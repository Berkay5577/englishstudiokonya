require 'sketchup.rb'
require 'extensions.rb'

plugin_dir = File.dirname(__FILE__)
$LOAD_PATH.unshift(plugin_dir) unless $LOAD_PATH.include?(plugin_dir)

module NanoBananaRender
  unless file_loaded?(__FILE__)
    ex = SketchupExtension.new('NanoBanana AI Render', 'nanobanano_render/main')
    ex.description = 'Render your SketchUp scenes using NanoBanana AI.'
    ex.version     = '1.0.0'
    ex.copyright   = '© 2026'
    ex.creator     = 'NanoBanana Team'
    Sketchup.register_extension(ex, true)
    file_loaded(__FILE__)
  end
end
