import { useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Button, Switch } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'

import { DiceRoll } from '@dice-roller/rpg-dice-roller';

// Helper functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function maxAtt(attsObj) {
  let max_att = 'Str'
  let max_att_val = 0

  for (let [key, value] of Object.entries(attsObj)) {
    if (value > max_att_val) {
      max_att_val = value
      max_att = key
    }
  }
  return max_att
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// Shadowdark Data
const shadowdark_str = `{
  "char_names": {"Dwarf": ["Hilde", "Torbin", "Marga", "Bruno", "Karina", "Naugrim", "Brenna", "Darvin", "Elga", "Alric", "Isolde", "Gendry", "Bruga", "Junnor", "Vidrid", "Torson", "Brielle", "Ulfgar", "Sarna", "Grimm"],
                "Elf": ["Eliara", "Ryarn", "Sariel", "Tirolas", "Galira", "Varos", "Daeniel", "Axidor", "Hiralia", "Cyrwin", "Lothiel", "Zaphiel", "Nayra", "Ithior", "Amriel", "Elyon", "Jirwyn", "Natinel", "Fiora", "Ruhiel"],
                "Goblin": ["Iggs", "Tark", "Nix", "Lenk", "Roke", "Fitz", "Tila", "Riggs", "Prim", "Zeb", "Finn", "Borg", "Yark", "Deeg", "Nibs", "Brak", "Fink", "Rizzo", "Squib", "Grix"],
                "Halfling": ["Willow", "Benny", "Annie", "Tucker", "Marie", "Hobb", "Cora", "Gordie", "Rose", "Ardo", "Alma", "Norbert", "Jennie", "Barvin", "Tilly", "Pike", "Lydia", "Marlow", "Astrid", "Jasper"],
                "Half-orc": ["Vara", "Gralk", "Ranna", "Korv", "Zasha", "Hrogar", "Klara", "Tragan", "Brolga", "Drago", "Yelena", "Krull", "Ulara", "Tulk", "Shiraal", "Wulf", "Ivara", "Hirok", "Aja", "Zoraan"],
                "Human": ["Zali", "Bram", "Clara", "Nattias", "Rina", "Denton", "Mirena", "Aran", "Morgan", "Giralt", "Tamra", "Oscar", "Ishana", "Rogar", "Jasmin", "Tarin", "Yuri", "Malchor", "Lienna", "Godfrey"]},
  "common_languages": ["Common", "Dwarvish", "Elvish", "Giant", "Goblin", "Merran", "Orcish", "Reptillian", "Sylvan", "Thanian"],
  "rare_languages": ["Celestial", "Diabolic", "Draconic", "Primordial"],
  "ancestries": {"Dwarf": {"languages": ["Common", "Dwarven"],
                  "ability": "Stout. Start with +2 HP. Roll your hit point gains with advantage."},
                "Elf": {"languages": ["Common", "Elvish", "Sylvan"],
                        "ability": "Farsight. You get a +1 bonus to attack rolls with ranged weapons or a +1 bonus to spellcasting checks."},
                "Goblin": {"languages": ["Common", "Goblin"],
                          "ability": "Keen Senses. You can't be surprised."},
                "Halfling": {"languages": ["Common"],
                            "ability": "Stealthy. Once per day, you can become invisible for 3 rounds."},
                "Half-orc": {"languages": ["Common", "Orcish"],
                            "ability": "Mighty. You have a +1 bonus to attack and damage rolls with melee weapons."},
                "Human": {"languages": ["Common"],
                          "ability": "Ambitious. You gain one additional talent roll at 1st level."}},
  "alignments": ["Lawful", "Neutral", "Chaotic"],
  "backgrounds": ["Urchin. You grew up in the merciless streets of a large city",
                "Wanted. There's a price on your head, but you have allies",
                "Cult Initiate. You know blasphemous secrets and rituals",
                "Thieves' Guild. You have connections, contacts, and debts",
                "Banished. Your people cast you out for supposed crimes",
                "Orphaned. An unusual guardian rescued and raised you",
                "Wizard's Apprentice. You have a knack and eye for magic",
                "Jeweler. You can easily appraise value and authenticity",
                "Herbalist. You know plants, medicines, and poisons",
                "Barbarian. You left the horde, but it never quite left you",
                "Mercenary. You fought friend and foe alike for your coin",
                "Sailor. Pirate, privateer, or merchant — the seas are yours",
                "Acolyte. You're well trained in religious rites and doctrines",
                "Soldier. You served as a fighter in an organized army",
                "Ranger. The woods and wilds are your true home",
                "Scout. You survived on stealth, observation, and speed",
                "Minstrel. You've traveled far with your charm and talent",
                "Scholar. You know much about ancient history and lore",
                "Noble. A famous name has opened many doors for you",
                "Chirurgeon. You know anatomy, surgery, and first aid"],
  "char_classes": ["Fighter", "Priest", "Thief", "Wizard"],
  "gear_items": ["Torch", "Dagger", "Pole", "Rations (3)", "Rope, 60'", "Oil, flask",
                "Crowbar", "Iron spikes (10)", "Flint and steel", "Grappling hook", "Shield", "Caltrops (one bag)"],
  "deities": {"Lawful": ["Saint Terragnis", "Medeera the Covenant"],
            "Neutral": ["Gede", "Ord"],
            "Chaotic": ["Memnon", "Ramlaat", "Shune the Vile"]},
  "talents": {"Fighter": ["Gain Weapon Mastery with one additional weapon",
                    "+1 to melee and ranged attacks",
                    "+2 to Strength, Dexterity, or Constitution stat",
                    "Choose one kind of armor. You get +1 AC from that armor 12",
                    "Choose a talent or +2 points to distribute to stats"],
            "Priest": ["Gain advantage on casting one spell you know",
                      "+1 to melee or ranged attacks",
                      "+1 to priest spellcasting checks",
                      "+2 to Strength or Wisdom stat",
                      "Choose a talent or +2 points to distribute to stats"],
            "Thief": ["Gain advantage on initiative rolls (reroll if duplicate)",
                      "Your Backstab deals +1 dice of damage",
                      "+2 to Strength, Dexterity, or Charisma stat",
                      "+1 to melee and ranged attacks",
                      "Choose a talent or +2 points to distribute to stats"],
            "Wizard": ["Make one random magic item (see GM Quickstart Guide)",
                      "+2 to Intelligence stat or +1 to wizard spellcasting checks",
                      "Gain advantage on casting one spell you know",
                      "Learn one additional wizard spell of any tier you know",
                      "Choose a talent or +2 points to distribute to stats"]},
  "hit_dice": {"Fighter": "1d8",
            "Priest": "1d6",
            "Thief": "1d4",
            "Wizard": "1d4"},
  "spells": {"Priest": {"Tier 1": ["Cure Wounds", "Holy Weapon", "Light", "Protection from Evil", "Shieldo of Faith", "Turn Undead"],
                      "Tier 2": ["Augury", "Blind/Deafen", "Bless", "Cleansing Weapon", "Smite", "Zone of Truth"]},
          "Wizard": {"Tier 1": ["Alarm", "Burning Hands", "Charm Person", "Detect Magic", "Feather Fall", "Floating Disk", "Hold Portal", "Light", "Mage Armor", "Magic Missile", "Protection from Evil", "Sleep"],
                    "Tier 2": ["Acid Arrow", "Alter Self", "Detect Thoughts Fixed Object", "Hold Person", "Invisibility", "Knock", "Levitate", "Mirror Image", "Misty Step", "Silence", "Web"]}},
  "weapons": {"Fighter": ["Bastard sword", "Club", "Crossbow", "Dagger", "Greataxe", "Greatsword", "Javelin", "Longbow", "Longsword", "Mace", "Shortbow", "Shortsword", "Spear", "Staff", "Warhammer"],
            "Priest": ["Club", "Crossbow", "Dagger", "Mace", "Longsword", "Staff", "Warhammer"],
            "Thief": ["Club", "Crossbow", "Dagger", "Shortbow", "Shortsword"],
            "Wizard": ["Dagger", "Staff"]},
  "armor_sets": {"Fighter": ["Leather armor", "Chainmail", "Plate mail"],
                "Priest": ["Leather armor", "Chainmail", "Plate mail"],
                "Thief": ["Leather armor"],
              "Wizard": ["None"]}
}`

const shadowdark = JSON.parse(shadowdark_str)

function App() {
  // Random NPC Generator Logic
  let no14plus = true

  let str = 0
  let dex = 0
  let con = 0
  let int = 0
  let wis = 0
  let cha = 0

  while(no14plus) {
    str = new DiceRoll('3d6').total
    dex = new DiceRoll('3d6').total
    con = new DiceRoll('3d6').total
    int = new DiceRoll('3d6').total
    wis = new DiceRoll('3d6').total
    cha = new DiceRoll('3d6').total

    no14plus = ((str < 14) && (dex < 14) && (con < 14) && (int < 14) && (wis < 14) && (cha < 14))
  }

  let atts = {'Str': str, 'Dex': dex, 'Con': con, 'Int': int, 'Wis': wis, 'Cha': cha}
  let mods = {1: -4, 2: -4, 3: -4, 4: -3, 5: -3, 6: -2, 7: -2, 8: -1, 9: -1, 10: 0, 11: 0, 12: 1, 13: 1, 14: 2, 15: 2,
    16: 3, 17: 3, 18: 4}

  let max_att = maxAtt(atts)

  let ancestry = choose(Object.keys(shadowdark['ancestries']))

  let languages = JSON.parse(JSON.stringify(shadowdark['common_languages']))
  let languages_known = []

  for (let lang of shadowdark['ancestries'][ancestry]['languages']) {
    let index = shadowdark['ancestries'][ancestry]['languages'].indexOf(lang)
    languages.splice(index, 1)
    languages_known.push(lang)
  }

  if (ancestry === 'Human') {
    let r = randInt(1, languages.length-1)
    languages_known.push(...languages.splice(r, 1))
  }

  let char_name = choose(shadowdark['char_names'][ancestry])

  let alignment = choose(shadowdark['alignments'])
  let background = choose(shadowdark['backgrounds'])
  let deity = choose(shadowdark['deities'][alignment])

  let char_class = ''

  if ((max_att === 'Str') || (max_att === 'Con'))
      char_class = 'Fighter'
  else if (max_att === 'Wis')
      char_class = 'Priest'
  else if (max_att === 'Int')
      char_class = 'Wizard'
  else
      char_class = 'Thief'

  let talents_pool = JSON.parse(JSON.stringify(shadowdark['talents'][char_class]))

  let weapon = choose(shadowdark['weapons'][char_class])
  let armor = choose(shadowdark['armor_sets'][char_class])
  let gear_pool = JSON.parse(JSON.stringify(shadowdark['gear_items']))

  let gear = [...gear_pool.splice(randInt(0, gear_pool.length-1), 1)]
  gear.push(...gear_pool.splice(randInt(0, gear_pool.length-1), 1))
  gear.push(...gear_pool.splice(randInt(0, gear_pool.length-1), 1))

  let gear_str = gear.join(', ')

  let start_talents = [choose(talents_pool)]

  let human_bonus_talent = ''

  if (ancestry === 'Human') {
    human_bonus_talent += talents_pool.splice(randInt(0, talents_pool.length-1)) + "."
    start_talents.push(human_bonus_talent)
  }

  let ancestry_ability = shadowdark['ancestries'][ancestry]['ability'] + human_bonus_talent

  let hp = new DiceRoll(shadowdark['hit_dice'][char_class]).total + mods[atts['Con']]

  if (ancestry === 'Dwarf')
    hp += 2

  if (hp < 1) {
    hp = 1
  }

  let spells_prepared = ''

  if ((char_class === 'Priest') || (char_class === 'Wizard')) {
      spells_prepared += '\n'
      let spell_list = JSON.parse(JSON.stringify(shadowdark['spells'][char_class]['Tier 1']))
      let spell1 = spell_list.splice(randInt(0, spell_list.length-1), 1)
      spells_prepared += spell1 + ', '
      let spell2 = spell_list.splice(randInt(0, spell_list.length-1), 1)
      spells_prepared += spell2
      if (char_class === 'Wizard') {
          let spell3 = spell_list.splice(randInt(0, spell_list.length-1), 1)
          spells_prepared += ', ' + spell3
          
          let rare_languages_pool = JSON.parse(JSON.stringify(shadowdark['rare_languages']))
          
          // add 2 common languages
          languages_known.push(languages.splice(randInt(0, languages.length-1), 1))
          languages_known.push(languages.splice(randInt(0, languages.length-1), 1))
          
          // add 2 rare languages
          languages_known.push(rare_languages_pool.splice(randInt(0, rare_languages_pool.length-1), 1))
          languages_known.push(rare_languages_pool.splice(randInt(0, rare_languages_pool.length-1), 1))
      }
      spells_prepared += '.'
  }

  let languages_known_str = languages_known.join(', ')
  let start_talents_str = start_talents.join(' ')

  let SpellsPrepared = () => {
    return(<>
      <strong>Spells Prepared:</strong> {spells_prepared}<br />
    </>)
  }

	const [theme, settheme] = useState(false);
  const [name, setName] = useState(char_name)
	const darkTheme = createTheme({
		palette: {
			mode: theme ? 'dark' : 'light',
		},
	});
	const handleChange = (event) => {
		settheme(event.target.checked);
	}
  const handleSubmit = (event) => {
    event.preventDefault()
    setName(choose(shadowdark['char_names'][ancestry]))
  }
	return (
		<div className="App">
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
        <h1>Unofficial Shadowdark RPG Character Generator</h1>
        <form onSubmit={handleSubmit}>
        <p><strong>Name:</strong> {name}<br />
<strong>Str:</strong> {str} <strong>Dex:</strong> {dex} <strong>Con:</strong> {con} <strong>Int</strong> {int} <strong>Wis</strong> {wis} <strong>Cha:</strong> {cha}<br />
<strong>Class:</strong> {char_class}<br />
<strong>Ancestry:</strong> {ancestry}<br />
<strong>Ancestry Ability:</strong> {ancestry_ability}<br />
<strong>Languages:</strong> {languages_known_str}<br />
<strong>Alignment:</strong> {alignment}<br />
<strong>Deity:</strong> {deity}<br />
<strong>Background:</strong> {background}<br />
<strong>Talents:</strong> {start_talents_str}<br />
<strong>HP:</strong> {hp}<br />
{ spells_prepared === '' ? '' : <SpellsPrepared /> }
<strong>Weapon:</strong> {weapon}<br />
<strong>Armor:</strong> {armor}<br />
<strong>Gear:</strong> {gear_str}<br /></p>
        <Button variant="outlined" type="submit">Reload</Button>
        </form><br /><br />
				<label>Dark/Light</label>
				<Switch
					checked={theme}
					color='success'
					onChange={handleChange} />
			</ThemeProvider>

		</div>
	);
}

export default App;
