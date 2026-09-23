# CyberRamz — First Meeting CTF Site

A small static site for your first CyberRamz meeting: 4 sequential challenges,
instant flag checking, no login required.

## How to host it on GitHub Pages

1. Create a new repo on GitHub (e.g. `cyberramz-ctf`).
2. Upload these files, keeping the folder structure exactly as-is:
   ```
   index.html
   style.css
   script.js
   secret/index.html
   assets/stego.png
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to "Deploy from a branch," pick
   your main branch and `/ (root)`, then save.
5. GitHub will give you a live URL, usually
   `https://yourusername.github.io/cyberramz-ctf/` — that's the link to share
   with your members.

No build step, no server, no dependencies to install — it's plain HTML/CSS/JS.

## How the challenges work

| Stage | Type | What they do | Flag |
|---|---|---|---|
| 1 | Caesar cipher + math + Base64 | Decode the Caesar text ("what's the square root of 4096?"), answer `64`, then decode the revealed Base64 string | `encryption-is-cool!` |
| 2 | Web exploitation | Find the un-linked `/secret` page (hinted in the page source as an HTML comment) | `secret-pages-are-tricky` |
| 3 | Forensics / steganography | Download `assets/stego.png` and run `strings stego.png` (or open it in a text editor) to find text appended after the image data | `hidden-in-plain-sight` |
| 4 | Kali commands | Answer 3 command questions (`nmap`, `whoami`, `ls -a`/`ls -la`); once all 3 are right, the flag is shown in plain text to copy in | `kali-linux-is-4-hackers` |

Stages unlock in order — members can't skip ahead. Progress is saved in each
device's browser (localStorage), so a reload won't lose their place. There's a
small "reset progress" link in the footer if you need to reset a laptop
between teams.

Flags are checked client-side (viewable in `script.js` if anyone opens dev
tools and looks) — that's expected and fine for a friendly, beginner first
meeting. If you ever want it more tamper-resistant for a real competition,
that would mean adding a small backend, which is a good "built to grow" next
step.

## Customizing later

- Add more stages by copying a `<section class="stage">` block in `index.html`
  and adding matching logic in `script.js`.
- Add a scoreboard by having each team's browser POST their completion time to
  a small backend (e.g. a Google Form, Airtable, or a lightweight serverless
  function) — not included yet, but the structure is ready for it.
