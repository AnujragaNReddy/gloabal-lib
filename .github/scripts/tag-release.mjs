// Runs on every push to main. It is a no-op unless package.json's version has
// no matching git tag yet, which is only true right after a "Version Packages"
// PR (see .github/workflows/version.yml) has just been merged.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

function run(cmd, args, options = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', ...options });
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const version = pkg.version;
const tag = `v${version}`;

const existingTags = run('git', ['tag', '-l', tag]).trim();
if (existingTags === tag) {
  console.log(`${tag} already exists — nothing to do.`);
  process.exit(0);
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const headingPattern = new RegExp(`^## \\[${escapedVersion}\\][^\\n]*\\n`, 'm');
const headingMatch = headingPattern.exec(changelog);

if (!headingMatch) {
  console.log(`No CHANGELOG.md section found for ${tag} — skipping tag/release.`);
  process.exit(0);
}

const sectionStart = headingMatch.index + headingMatch[0].length;
const rest = changelog.slice(sectionStart);
const nextHeadingIndex = rest.search(/^## \[/m);
const rawBody = nextHeadingIndex === -1 ? rest : rest.slice(0, nextHeadingIndex);
const body = rawBody.replace(/\n?-{3,}\s*$/, '').trim() || '_No notes._';

writeFileSync('release-notes.md', body);

run('git', ['config', 'user.name', 'github-actions[bot]']);
run('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
run('git', ['tag', '-a', tag, '-m', `Release ${tag}`]);
run('git', ['push', 'origin', tag]);

run('gh', ['release', 'create', tag, '--title', tag, '--notes-file', 'release-notes.md'], {
  stdio: 'inherit',
});

console.log(`Created tag and release ${tag}.`);
