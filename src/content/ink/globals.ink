// Section 8.1 – state shared by all days. Included by every day file [ARC-1].

// Set in the prologue
VAR name = ""
VAR pronoun = "n"
VAR house = ""
VAR hat_overruled = false
VAR wand = ""
VAR pet = ""

// Relationships (clamped by the app: bond 0–5, trust −2…+3)
VAR bond_ellis = 1
VAR trust_theo = 0
VAR trust_maren = 0
VAR trust_grimsby = 0
VAR trust_aldous = 0

// Investigation (Section 8.3) and inventory (Section 8.4)
LIST clues = k01, k02, k03, k04, k05, k06, k07, k08, k09, k10
LIST items = bookmark, anonymous_letter, house_token, lantern, archive_key, gift_scarf, gift_music_box, theo_wrench

VAR route = ""
VAR accused = ""
VAR ending = ""
VAR maren_covered = false

// Tone flags for later callbacks (storyboard/globals-zusatz.ink); no effect on clues or endings
VAR f_d01_watch = false     // d01.secret.watch – day 9
VAR peeves_friend = false   // d02.peeves.join – day 19
VAR wrote_home = false      // d07.home.write – day 24
VAR ate_rockcake = false    // d11.hagrid.eat – day 16

// Set by the app after each puzzle [ARC-3]
VAR last_puzzle_first_try = false

// [ARC-4] Provided by the app (DialogueRunner)
EXTERNAL personal(key)
EXTERNAL house_name()
EXTERNAL pronoun_form(f, m, n)
EXTERNAL has_clue(id)
