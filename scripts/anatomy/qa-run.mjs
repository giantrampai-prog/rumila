// Run a reviewed Playwright CLI snippet file without interpolating it into shell code.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
let code=fs.readFileSync(process.argv[2],'utf8');
if(code.includes('SUPABASE_STORAGE_KEY')){
 const env=fs.readFileSync('.env.local','utf8');
 const url=env.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)?.[1].replace(/["']/g,'').trim();
 if(!url)throw new Error('Missing public Supabase URL');
 code=code.replace('SUPABASE_STORAGE_KEY','sb-'+new URL(url).hostname.split('.')[0]+'-auth-token');
}
const r=spawnSync('/Users/macbook/.codex/skills/playwright/scripts/playwright_cli.sh',['--session',process.env.ANATOMY_QA_SESSION||'rumila-auto','run-code',code],{encoding:'utf8'});
const result=r.stdout||r.stderr;console.log(result.slice(-6000));process.exitCode=r.status||0;
