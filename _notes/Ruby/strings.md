---
---

# strings

@match
```ruby
# so, find all the files with the timestamped suffix, then renaming those files to their original name without the suffix.
# @-----%----->---[description](
#
files = `fdfind --full-path -t d -t f -a -L #{Dir.pwd}`

files = fix_encoding(files)

files = files.split("\n")

files.each do |file|
  begin
    matches = file.match(/(.+)(_2021-10-13_1254)/)
    unless matches.nil?
      p matches
      nf = file.gsub("_2021-10-13_1254","")
      if File.symlink?
        FileUtils.rm(file)
      else
        File.rename(file,nf)
      end
    end
    puts "nothing"
  rescue StandardError =) e
    puts "#{e.message}"
  end
end

```

