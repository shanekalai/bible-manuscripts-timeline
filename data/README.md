# New Testament Manuscript Data

This directory contains the manuscript data for the NT Manuscripts Timeline application.

## Data Structure

### manuscripts.json

The main data file containing:

#### Metadata
- Version and update information
- Source URLs for data verification
- Total manuscript count

#### Locations
Geographic locations relevant to manuscript origins and discoveries:
- Ancient cities (Jerusalem, Alexandria, Oxyrhynchus, etc.)
- Coordinates (latitude/longitude) for map visualization

#### Repositories
Current institutions holding manuscripts:
- Library names and cities
- Coordinates for optional repository visualization

#### Manuscripts
Individual manuscript records with:

| Field | Description |
|-------|-------------|
| `id` | Gregory-Aland number (P1-P141 for papyri, 01-0323 for uncials) |
| `name` | Common name or designation |
| `type` | `papyrus`, `uncial`, `minuscule`, or `lectionary` |
| `dateStart` | Earliest estimated date (year AD) |
| `dateEnd` | Latest estimated date (year AD) |
| `dateBest` | Best estimated date for timeline positioning |
| `contents` | NT passages contained |
| `books` | Array of NT book names |
| `textType` | `Alexandrian`, `Byzantine`, `Western`, `Caesarean`, or `Mixed` |
| `originLocation` | Key to locations object (where manuscript originated) |
| `discoveryLocation` | Key to locations object (where found, if different) |
| `repository` | Key to repositories object (current location) |
| `material` | `papyrus` or `parchment` |
| `leaves` | Number of surviving leaves/folios |
| `category` | Aland category (1-5, with 1 being highest quality) |
| `significance` | Notable features or importance |
| `csntmUrl` | Link to CSNTM digital images |
| `imageAvailable` | Boolean indicating if images are accessible online |
| `notes` | Additional information |

#### Timeline Events
Key historical events for context in the timeline visualization.

#### Spread Patterns
Geographic spread of manuscripts through different historical periods.

## Data Sources

1. **CSNTM** (Center for the Study of New Testament Manuscripts)
   - https://manuscripts.csntm.org/
   - Digital images and manuscript metadata

2. **Greek CNTR** (Center for New Testament Restoration)
   - https://greekcntr.org/manuscripts/
   - Transcriptions of early manuscripts (pre-400 AD)

3. **NTVMR** (New Testament Virtual Manuscript Room)
   - https://ntvmr.uni-muenster.de/
   - Official Kurzgefasste Liste catalog from INTF Münster

4. **Wikipedia Lists**
   - List of New Testament papyri
   - List of New Testament uncials
   - Individual manuscript articles

## Date Conventions

- All dates are AD/CE unless otherwise noted
- Date ranges represent paleographic estimates
- `dateBest` is used for timeline positioning and represents scholarly consensus

## Categories (Aland Classification)

| Category | Description |
|----------|-------------|
| I | Very special quality, closer to original |
| II | Special quality, less consistency |
| III | Distinctive character, independent |
| IV | D text (Western), distinctive |
| V | Byzantine text-type |

## Coordinate System

- Coordinates use WGS84 (standard GPS coordinates)
- Format: decimal degrees (lat, lng)
- Origin locations prioritize discovery sites when known

## Contributing

To add or update manuscript data:

1. Verify information against primary sources (NTVMR, CSNTM)
2. Include Gregory-Aland numbers for identification
3. Provide date ranges with scholarly justification
4. Add image URLs when available from CSNTM or institutional sources

## License

Data compiled from publicly available scholarly sources for educational purposes.
