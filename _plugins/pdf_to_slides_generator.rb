require 'vips'
require 'fileutils'
require 'json'

module Jekyll
  class PdfToSlidesGenerator < Generator
    safe true
    priority :low

    def generate(site)
      pdf_dir = File.join(site.source, '_pdfs')
      return unless Dir.exist?(pdf_dir)

      output_base = File.join(site.source, 'assets/images/slides')
      FileUtils.mkdir_p(output_base)

      Dir.glob(File.join(pdf_dir, '*.pdf')).each do |pdf_path|
        pdf_name = File.basename(pdf_path, '.pdf')
        pdf_slug = Utils.slugify(pdf_name)
        pdf_dest_dir = File.join(output_base, pdf_slug)

        # Check if we need to regenerate
        pdf_mtime = File.mtime(pdf_path)
        last_gen_file = File.join(pdf_dest_dir, '.last_gen')

        needs_gen = true
        if File.exist?(last_gen_file)
          last_gen_time = Time.parse(File.read(last_gen_file))
          needs_gen = pdf_mtime > last_gen_time
        end

        image_paths = []
        if needs_gen
          Jekyll.logger.info 'PDF Slides:', "Converting #{pdf_name}..."
          FileUtils.mkdir_p(pdf_dest_dir)

          # Use ruby-vips to get page count and convert
          # Note: vips uses 0-based indexing for pages
          begin
            # Load the first page to get metadata (vips can load all pages but it's memory intensive)
            # Actually, vips can load n pages. We'll iterate until failure or use a specific loader.
            i = 0
            loop do
              # Load specific page at 300 DPI for high quality
              image = Vips::Image.new_from_file(pdf_path, page: i, dpi: 300)
              image_filename = "page-#{i + 1}.jpg"
              image_dest = File.join(pdf_dest_dir, image_filename)

              # Save as JPEG with good quality
              image.write_to_file(image_dest, Q: 85, optimize_coding: true, strip: true)
              image_paths << "/assets/images/slides/#{pdf_slug}/#{image_filename}"
              i += 1
            rescue Vips::Error
              # Usually means we've hit the end of the pages
              break
            end

            File.write(last_gen_file, pdf_mtime.to_s)
            Jekyll.logger.info 'PDF Slides:', "Converted #{i} pages for #{pdf_name}"
          rescue StandardError => e
            Jekyll.logger.error 'PDF Slides Error:', "Failed to convert #{pdf_name}: #{e.message}"
            next
          end
        else
          # Already generated, just collect paths
          Dir.glob(File.join(pdf_dest_dir, 'page-*.jpg')).sort_by { |f| f.match(/page-(\d+)/)[1].to_i }.each do |img|
            image_paths << "/assets/images/slides/#{pdf_slug}/#{File.basename(img)}"
          end
        end

        # Create virtual page for this PDF deck
        site.pages << PdfSlidePage.new(site, site.source, pdf_slug, pdf_name, image_paths)
      end
    end
  end

  class PdfSlidePage < Page
    def initialize(site, base, slug, title, images)
      @site = site
      @base = base
      @dir  = "slides/pdf/#{slug}"
      @name = 'index.html'

      process(@name)

      self.data = {
        'layout' => 'pdf_presentation',
        'title' => "Presentation: #{title}",
        'pdf_images' => images,
        'permalink' => "/slides/pdf/#{slug}/"
      }
      self.content = ''
    end
  end
end
