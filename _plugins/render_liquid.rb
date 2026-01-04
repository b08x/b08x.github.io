module Jekyll
  module RenderLiquidFilter
    def render_liquid(input)
      render_recursive(input)
    end

    private

    def render_recursive(input)
      case input
      when String
        Liquid::Template.parse(input).render(@context)
      when Hash
        input.each_with_object({}) { |(k, v), h| h[k] = render_recursive(v) }
      when Array
        input.map { |v| render_recursive(v) }
      else
        input
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::RenderLiquidFilter)
