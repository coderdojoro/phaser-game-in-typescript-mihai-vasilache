# build-server.sh
#!/bin/bash
echo initial PORT: $PORT

if [ -z "$PORT" ]
then
      export PORT=8000
else
      echo "keep PORT"
fi

echo "new PORT is $PORT"

npx serve -l $PORT dist
echo port: $PORT
