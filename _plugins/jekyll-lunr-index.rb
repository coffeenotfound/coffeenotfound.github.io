
Jekyll::Hooks.register :pages, :post_write do |page|
	#puts "on page write "
end

module Jekyll
	class LunrIndexTag < Liquid::Block
		def initialize(tag_name, markup, tokens)
			super
			@lunrfield = markup
		end
		
		def render(context)
			super
		end
	end
end

# register tag
Liquid::Template.register_tag("lunr_index", Jekyll::LunrIndexTag)