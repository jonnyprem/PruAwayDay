# Prudential Cambodia — Operations & Technology Away Day 2026

Static event site for the Prudential Cambodia Operations & Technology Away Day, 7–9 August 2026 in Siem Reap.

Live: https://jonnyprem.github.io/PruAwayDay/

## Stack

Plain HTML/CSS/JS — no build step, no dependencies. Deployed via GitHub Pages from the `main` branch.

## Structure

```
index.html        Page markup (hero, journey/roadmap, itinerary, highlights, photo hunt,
                   bus & room assignments, gallery, emergency contacts)
css/styles.css     All styling, incl. responsive breakpoints
js/main.js         All behavior: countdown, tabs, search, gallery lightbox, etc.
assets/            Event photos
```

## Editing data

Everything content-related lives as arrays at the top of `js/main.js`:

- `ROOM_LIST` — `[name, room]` pairs. Leave `room` blank (`''`) to add someone to the
  group above (they'll share that room). A group's whole row is coloured together in the
  Bus & Room Assignments table.
- `BUS_LIST` — rows of `[bus1Name, bus2Name, bus3Name]`. Each of the three columns is
  colour-coded independently.
- `GALLERY_ITEMS` — `{ day, activity, file }` entries; `file` must match a filename in
  `assets/`. Photos are grouped by `day` and the lightbox slideshow follows this array's
  order.

## Running locally

No build step — just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deploying

Push to `main` — GitHub Pages rebuilds automatically.
