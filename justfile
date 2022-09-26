permissions := "--allow-read=./ --allow-net=0.0.0.0,status.vatsim.net,data.vatsim.net,api.vatsim.net"
runfile := "main.ts"
compiled_name := "vatsim_pilot_lookup"

run:
  @deno run {{permissions}} {{runfile}} -d

run-no-debug:
  @deno run {{permissions}} {{runfile}}

debug:
  @deno run --inspect-brk=0.0.0.0:9229 {{permissions}} {{runfile}}

compile:
  @rm -f {{compiled_name}} {{compiled_name}}.zip {{compiled_name}}.tar.gz
  @deno compile {{permissions}} {{runfile}}
  @zip -r {{compiled_name}}.zip {{compiled_name}} static
  @tar -cpzf {{compiled_name}}.tar.gz {{compiled_name}} static

deploy: clean compile
  rsync -avz --progress {{compiled_name}}.tar.gz "$SSH_HOST_NAME:/srv/{{compiled_name}}/"

clean:
  @rm -f {{compiled_name}} {{compiled_name}}.zip {{compiled_name}}.tar.gz
