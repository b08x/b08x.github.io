---
---

#ruby 

```ruby
# find files having the same fingerprint
def dupes

  b = $db["SELECT `fingerprint`, count(*) AS 'count', `basename` , `orginalPath`, `parentFolder`, GROUP_CONCAT(id) as ids FROM `audio_files` GROUP BY `fingerprint` HAVING (count(*) >= 2)"]

  dupes = {}

  b.each do |row|
    next if row[:fingerprint].nil?
    # if !row[:orginalPath].match?(/\s\(\d\)$/)
    #   p row[:orginalPath]
    # end

    dupes[:id] = row[:ids].split(',').map {|id| id.to_i}

    dupes[:paths] = []
    puts "### dupes for #{row[:orginalPath]} ###\n"
    dupes[:id].each do |id|
      y = AudioFiles.where(id: id).as_hash

      dupes[:paths] [description]([description]( { y[id][:orginalPath] =) [y[id][:id],y[id][:bitRate],y[id][:parentFolder],y[id][:duration]]}

      # x = AudioFiles.where(fingerprint: y[id][:fingerprint]).as_hash
      # p x[id][:basename]
      # p y[id][:orginalPath]
      # puts "xxxxxxxxxxxxxx"
      #dupes[:paths] [description](< y.all[0][:orginalPath]
    end

    dupe = {}

    p dupes[:paths]

    dupes[:paths].each do |hash|
      hash.each_pair do |file, id|
        dupe[:id] = id[0] if file.match?(/(\s\(\d\))/)
        dupe[:path] = file if file.match?(/(\s\(\d\))/)
        dupe[:parentFolder] = id[2] if file.match?(/(\s\(\d\))/)
        dupe[:duration] = id[3] if file.match?(/(\s\(\d\))/)
      end
    end
    puts "\n"

    unless dupe[:path].nil?

      p dupe[:path]

      temp_dir = File.join($library, 'temp', dupe[:parentFolder], "/")

      FileUtils.mkdir_p(temp_dir)

      if File.exist?(dupe[:path])
        begin
          FileUtils.mv dupe[:path], temp_dir
        rescue
          AudioFiles.where(id: dupe[:id]).delete
        end
        AudioFiles.where(id: dupe[:id]).delete
      end

    end
  end
end

```



```ruby
# AudioFiles.select(:id, :fileName, :peak).order(:fileName).where{peak )= -3.0.to_f}.
#
# AudioFiles.where(:dcoffset).update(dcoffset: 0.00)
#
# AudioFiles.where(:id =) 124).get(:fileName)

# x = AudioFiles.group_and_count(:basename,:fingerprint).having{count.function.* >= 2}
# #[description](Sequel::SQLite::Dataset: "SELECT `basename`, `fingerprint`, count(*) AS 'count' FROM `audio_files` GROUP BY `basename`, `fingerprint` HAVING (count(*) )= 2)">
# x = AudioFiles.group_and_count(:basename).having{count.function.* >= 2}.select_append(:fingerprint)
# #[description](Sequel::SQLite::Dataset: "SELECT `basename`, count(*) AS 'count', `fingerprint` FROM `audio_files` GROUP BY `basename` HAVING (count(*) )= 2)">
```



