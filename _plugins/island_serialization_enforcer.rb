# Standardized Serialization Enforcer
# Fails the build if 'jsonify' is used in _includes without trailing 'escape'
# This prevents DOM attribute termination vulnerabilities in React islands.

Jekyll::Hooks.register :site, :after_init do |site|
  includes_dir = File.join(site.source, '_includes')
  next unless Dir.exist?(includes_dir)

  violations = []
  
  # Regex explanation:
  # Look for 'jsonify' but NOT followed by '| escape' or '| base64_encode'
  # Uses negative lookahead that includes leading whitespace to prevent false positives.
  pattern = /jsonify(?!\s*\|\s*(escape|base64_encode))/

  Dir.glob(File.join(includes_dir, "**", "*.{html,liquid}")).each do |file|
    content = File.read(file)
    if content =~ pattern
      # Get line number
      content.each_line.with_index(1) do |line, index|
        if line =~ pattern
          violations << "#{file}:#{index} -> '#{line.strip}'"
        end
      end
    end
  end

  unless violations.empty?
    Jekyll.logger.error "Serialization Error:", "Found 'jsonify' without trailing 'escape' in _includes."
    Jekyll.logger.error "", "This is a security risk for React island props."
    violations.each { |v| Jekyll.logger.error "", "  - #{v}" }
    raise "Build failed due to serialization violations. See logs above."
  end
end
