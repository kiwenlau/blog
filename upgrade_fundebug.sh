#!/bin/bash

old=$1
new=$2

if [ -z "$old" ]
then
   echo "请指定旧版本"
   exit 1
fi

if [ -z "$new" ]
then
   echo "请指定新版本"
   exit 1
fi

# 命令示例：sed -i '.bak' "s/fundebug\.1.0.4\.min.js/fundebug\.1.0.5\.min\.js/g" themes/light/layout/\_partial/head.ejs
sed -i '.bak' "s/fundebug\.$old\.min.js/fundebug\.$new\.min\.js/g" themes/light/layout/\_partial/head.ejs