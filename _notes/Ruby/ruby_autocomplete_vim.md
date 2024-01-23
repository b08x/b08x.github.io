---
---

# 26121533 ruby autocomplete vim
@ruby @vim @solargraph


cd Workspace/soundbot

# generate documention for non-core gems
```
solargraph config .
solargraph bundle
```

# download plugin to vim folder
```sh
mkdir -p ~/.vim/pack/coc/start
cd ~/.vim/pack/coc/start
curl --fail -L https://github.com/neoclide/coc.nvim/archive/release.tar.gz|tar xzfv -
```

# open vim

:CocInstall coc-solargraph

# open ruby file

:CocEnable

# enjoy

