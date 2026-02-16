const PALETTE_DEFAULT = {};
let COLORS_SCHEME_DEFAULT_PALETTE = {
	trashcan: {
		fill: "#555555",
		stroke: "#333333"
	},
	rocket: {
		health_bg: "red",
		health_fill: "lime",
		wings: "red",
		color: "gray"
	},
	cars: {
		types: {
			default: {
				body: "#555",
				outline: "#000"
			},
			police: {
				body: "#222222",
				stripe: "#005ecb",
				line: "#ffffff",
				siren_alt: "#0000ff"
			},
			fireman: {
				body: "#b22222",
				ladder: "#dddddd",
				siren_alt: "#ffaa00"
			},
			ambulance: {
				body: "#f0f0f0",
				stripe: "#d32f2f",
				siren_alt: "#ffaa00"
			},
			taxi: {
				body: "#f7b500",
				checkers: "#000000",
				sign_bg: "#000000",
				sign_text: "#ffcc00"
			}
		},
		common: {
			outline: "#000000",
			shadow: "rgba(0, 0, 0, 0.3)",
			glass: "#aaddff",
			glass_outline: "#222222",
			glass_reflection: "rgba(255, 255, 255, 0.4)",
			wheels: "#111111",
			siren_red: "#ff0000"
		},
		tank: {
			tracks: "#1a1a1a",
			track_lines: "#333333",
			barrel: "#222222",
			muzzle: "black"
		},
		ui: {
			health_bg: "red",
			health_fill: "lime",
			fuel_bg: "red",
			fuel_fill: "gray"
		}
	},
	bullets: {
		default_fill: "yellow",
		default_outline: "yellow",
	},
	player: {
		red: "red",
		blue: "blue",
		yellow: "yellow",
		lime: "lime",
		hair_default: "#442200",
		skin: "#d2b48c",
		eye_white: "white",
		eye_iris: "black",
		shoes: "#111",
		arm_sleeve: "#222",
		arm_hand: "#111",
		outline: "black",
		laser_glow: "white",
		shield_blue_fill: "#1177aa",
		shield_blue_stroke: "#113377",
		indicator_bg: "red",
		indicator_health: "lime",
		indicator_thirst: "cyan",
		indicator_hunger: "orange",
		indicator_shield_bg: "gray"
	},
	enemies: {
		regular: {
			body: "green",
			outline: "white",
			eye: "red"
		},
		shooting: {
			body: "#335544",
			outline: "white",
			eye: "red",
			gun: "#331133",
			bullet_fill: "blue",
			bullet_outline: "white"
		},
		desert: {
			body: "#c2a26b",
			outline: "#4d3d21",
			eye: "red",
			gun: "#222222",
			bullet_fill: "#aa4400",
			bullet_outline: "#ffcc00"
		},
		shooting_red: {
			body: "#999999",
			outline: "#aa3333",
			eye: "yellow",
			gun: "#551111",
			bullet_main: "red",
			bullet_alt: "pink"
		},
		sword: {
			body: "#bbaa11",
			outline: "lime",
			eye: "red",
			sword: "#55aa11",
			bullet_fill: "gray",
			bullet_outline: "lime"
		},
		mummy: {
			body: "#e2d1b3",
			outline: "#8b7355",
			eye: "#44bbff",
			gun: "#5588aa",
			bandage_shadow: "rgba(139, 115, 85, 0.5)",
			glow: "#44bbff"
		},
		rocket: {
			body: "gray",
			outline: "black",
			eye: "yellow",
			gun: "#113355"
		},
		shadow: {
			body: "rgba(10, 10, 10, 0.6)",
			body_icon: "#222222",
			outline: "white",
			eye: "purple",
			bullet_fill: "#4400ff",
			bullet_outline: "black"
		},
		anubis: {
			body: "#0a0a0a",
			outline: "#ffd700",
			eye: "#ffff00",
			gun: "#ffd700",
			cloth_alt: "#0033aa",
			bullet_fill: "#ff3300",
			bullet_outline: "#ffaa00",
			stream_fill: "orange",
			stream_outline: "black"
		},
		laser: {
			body_fallback: "#000000",
			outline: "white",
			eye: "white",
			gun: "#331133",
			rainbow: ["red", "orange", "yellow", "lime", "cyan", "blue",
				"purple"
			]
		},
		deer_boss: {
			body: "#4a2c16",
			outline: "#f2d291",
			eye: "red"
		},
		raccoon_boss: {
			body: "#444444",
			outline: "#ff0000",
			eye: "red",
			trash_bullet: "#666666"
		},
		scorpion_boss: {
			body: "#0a0a0a",
			eye: "#ff0000",
			venom_bullet: "#33ff00"
		},
		snake_boss: {
			body: "#1a1a1a",
			outline: "#00ff44",
			eye: "red",
			venom_stream: "lime",
			venom_outline: "black"
		}
	},
	entities: {
		animals: {
			deer: {
				main: "#3d2511",
				dark: "#1a0f07",
				light: "#8b6b4d",
				horn: "#f2d291",
				hoof: "#000000",
				eye_bg: "#ffffff",
				eye_pupil: "#000000",
				nose: "#1a0f07"
			},
			raccoon: {
				body: "#777777",
				outline: "#444444",
				ears: "#555555",
				mask: "#222222",
				eye_white: "white",
				eye_pupil: "black",
				nose: "#111111",
				tail_stripes: ["#333333", "#999999"]
			},
			snake: {
				body: "black",
				eye: "red"
			},
			scorpion: {
				dark: "#0a0a0a",
				mid: "#222222",
				light: "#3d3d3d",
				eye: "#ff0000",
				eye_shadow: "red"
			},
			bosses: {
				raccoon: {
					ears: "#333333",
					body: "#555555",
					mask: "#111111",
					eye: "#ff0000",
					eye_shadow: "red",
					mouth: "white",
					tail_stripes: ["#222222", "#666666"]
				},
				deer: {
					dark: "#1a0f07",
					horn: "#f2d291",
					hoof: "black",
					eye_pupil: "black"
				}
			}
		},
		indicators: {
			health_bg: "red",
			health_fill: "lime",
			hunger_bg: "red",
			hunger_fill: "orange"
		}
	},
	items: {
		cactus_juice: {
			liquid: "#4ade80",
			bottle: "#fef08a",
			label: "#166534",
			spike: "#064e3b"
		},
		money: {
			fill: "#11ff55",
			stroke: "#007733",
			icon: "#007733"
		},
		apple_core: {
			body: "#eeeecc",
			bit: "#ff4422",
			stick: "#442200"
		},
		fish_bone: {
			color: "#dddddd"
		},
		bottle: {
			body: "rgba(150, 200, 255, 0.4)",
			stroke: "white"
		},
		can: {
			body: "#999999",
			stripe: "#777777",
			inside: "#444444",
			reflection: "#bbbbbb",
			lid: "#888888"
		},
		shoe: {
			body: "#553311"
		},
		fork: {
			color: "#aaa"
		},
		crumpled_paper: {
			body: "#ffffff",
			stroke: "#cccccc",
			line: "#dddddd"
		},
		battery: {
			body: "#444444",
			bottom: "#222222",
			tip: "#777777",
			minus: "#333333"
		},
		diary: {
			cover: "#5d4037",
			spine: "#3e2723",
			lines: "#d7ccc8"
		},
		note: {
			paper: "#f5f5f5",
			border: "#bdbdbd",
			text: "#424242"
		},
		unknown: {
			bg: "#000000",
			accent: "#ff00ff"
		},
		venom_vial: {
			cork: "#5d2e0c",
			glass: "rgba(200, 200, 200, 0.3)",
			glass_outline: "#eee",
			liquid_base: [0, 120, 0],
			liquid_pulse: 30,
			skull: "#fff",
			eyes: "#000",
			reflection: "rgba(255, 255, 255, 0.2)"
		},
		ammo_standard: {
			main: "yellow",
			tip: "orange",
			outline: "orange"
		},
		ammo_plasma: {
			main: "cyan",
			tip: "blue",
			outline: "white"
		},
		ammo_red_plasma: {
			main: "pink",
			tip: "red",
			outline: "red"
		},
		ammo_corrosive: {
			main: "lime",
			tip: "green",
			outline: "green"
		},
		ammo_rocket: {
			main: "#666666",
			tip: "#bb3311",
			outline: "#111111"
		},
		ammo_rainbow: {
			mains: ["pink", "yellow", "lime", "cyan"],
			tips: ["red", "orange", "green", "blue"],
			outline: "white"
		},
		health_kit: {
			bg: "white",
			icon: "#1177ff",
			stroke: "#1177ff"
		},
		health_kit_adv: {
			bg: "white",
			icon: "#11ff77",
			stroke: "#11ff77"
		},
		fuel: {
			body: "#ff1111",
			shadow: "#cc1111",
			accent: "#dd1111",
			cap: "yellow",
			outline: "black"
		},
		canned_meat: {
			body: "gray",
			label: "#771111"
		},
		water: {
			bottle: "#777777",
			liquid: "#1177dd"
		},
		cola: {
			bottle: "#777777",
			liquid: "#dd1111"
		},
		milk: {
			top: "#113377",
			bottom: "#dddddd",
			outline: "black"
		},
		chocolate: {
			dark: "#331100",
			wrapper: "#aa0000",
			border: "#220800",
			gold: "#d4af37"
		},
		orange: {
			skin: "#ff8800",
			shadow: "#773311",
			light: "#ffaa44",
			stem: "#442200"
		},
		apple: {
			skin: "#ff4422",
			shadow: "#440000",
			stem: "#442200",
			leaf: "#33aa11",
			light: "rgba(255, 255, 255, 0.6)"
		},
		cherries: {
			stem: "#224400",
			fruit1: "#cc0000",
			fruit2: "#ee0000",
			shadow: "#660000",
			light: "white"
		},
		chicken: {
			bone: "#eeeeee",
			bone_shadow: "#cccccc",
			meat_dark: "#884411",
			meat_light: "#aa6622"
		},
		shield_energy: {
			fill: "cyan",
			outline: "white"
		},
		shield_kinetic: {
			fill: "lime",
			outline: "white"
		},
		shield_shadow: {
			fill: "#1a0033",
			outline: "#8800ff"
		},
		aegis: {
			body: "#cc0000",
			gold: "#FFD700"
		},
		bossifier: {
			bg: "black"
		}
	},
	weapons: {
		common: {
			metal: "#333333",
			metal_light: "#555555",
			metal_dark: "#222222",
			silver: "#A0A0A0",
			silver_light: "#D3D3D3",
			silver_dark: "#777777",
			silver_bright: "#cccccc",
			wood: "#8B4513",
			wood_dark: "#5D2E0C",
			wood_alt: "#773311",
			black: "#000000",
			black_soft: "#1A1A1A",
			gray: "#888888",
			gray_dark: "#444444",
			white_transp: "rgba(255,255,255,0.2)",
			white_gloss: "rgba(255, 255, 255, 0.3)"
		},
		venom: {
			liquid_base: [0, 150, 0],
			liquid_pulse: 105,
			liquid_smg_base: [0, 100, 0],
			liquid_smg_pulse: 155,
			vial_bg: "rgba(0, 255, 0, 0.2)",
			tentacle: "#22aa44",
			dark: "#0a3311",
			acid: "#44ff00",
			mid: "#117733"
		},
		energy: {
			plasma: "cyan",
			plasma_dark: "#331133",
			plasma_vdark: "#110011",
			soul_bg: "#D2B48C",
			soul_outline: "#8b7355",
			soul_glow: "#00ffff",
			void_body: "#1a0a25",
			void_glow: "rgba(170, 0, 255, 0.6)",
			void_core: "#4400ff",
			void_accent: "#ff00ff",
			void_vdark: "#0a0a0f",
			void_purple: "#220044",
			laser_main: "purple",
			laser_accent: "#ff00ff",
			laser_line: "white",
		},
		special: {
			mummy_pistol: "#D2B48C",
			mummy_bullet: "#44bbff",
			mummy_bullet_outline: "white",
			shadow_staff: "#1a0a25",
			shadow_bullet: "#4400ff",
			shadow_dual: "#0a0a0f",
			shadow_dual_bullet: "#8800ff",
			anubis_punisher: "#ffd700",
			anubis_bullet_red: "red",
			anubis_bullet_gold: "gold",
			snake_staff: "#1a0f05",
			snake_bullet: "#00ff44",
			snake_bullet_alt: "#ccff00",
			venom_dual: "#224422",
			venom_shotgun: "#225522",
			acid_smg: "#447744",
			acid_bullet: "#00ff00",
			acid_bullet_dark: "#008800",
			stone_bullet: "gray",
			stone_bullet_outline: "#333",
			kalashnikov: "#333333",
			kalash_bullet: "#ffcc00",
			green_gun: "#117733",
			rainbow_white: "white",
			red_main: "#dd1111",
			red_glow: "#FF0000",
			rocket_body: "#111133",
			rocket_eye: "red",
			rocket_alt: "orange",
			minigun_blue: "#113377",
			minigun_blue_light: "#2255aa",
			minigun_blue_dark: "#0a1f44",
			junk_body: "#444444",
			junk_alt: "#556677",
			junk_stroke: "blue",
			stone_stroke: "#666666",
			stick_main: "#8B4513",
			stick_stroke: "#5D2E0C",
			sword_blade: "#55aa11",
			sword_stroke: "#bbaa11",
			sword_handle: "#443311",
			sword_guard: "#332211",
			sword_lines: "rgba(0,0,0,0.25)",
			anubis_gold: "#FFD700",
			anubis_orange: "#FFA500",
			anubis_orange_transp: "rgba(255, 165, 0, 0.6)"
		}
	},
	ui: {
		hotbar: {
			cell_bg: "#4d4dff",
			cell_selected: "#00f2ff",
			button_bg: "#4477ff",
			button_hover: "#6699ff",
			button_outline: "white",
			indicator_outline: "rgba(255,255,255,0.4)",
			tooltip_bg: "black",
			tooltip_border: "gray",
			tooltip_title: "yellow",
			tooltip_text: "white",
			resources: {
				hunger_empty: "#331100",
				hunger_full: "#ff8800",
				thirst_empty: "#001144",
				thirst_full: "#1177dd",
				health_empty: "#880000",
				health_full: "#22ff22",
				shield_empty: "#444444",
				shield_default: "#00ffff"
			},
			icons: {
				inv_bag: "#a52a2a",
				inv_flap: "#8b4513",
				inv_buckle: "yellow",
				ach_cup: "gold",
				ach_outline: "orange"
			}
		},
		inventory: {
			cell_bg: "#4d4dff",
			cell_selected: "#00f2ff",
			cell_move: "#ff9d00",
			cell_hotbar_outline: "#00ffff",
			close_bg: "#444444",
			close_hover: "#882222",
			close_icon: "white",
			close_icon_hover: "#ffaaaa",
			btn_use: "#228822",
			btn_drop: "#882222",
			btn_text: "white",
			btn_outline: "white",
			popup_bg: "black",
			popup_border: "gray",
			popup_title: "yellow",
			popup_text: "white"
		},
		achievements: {
			bg: "black",
			border: "white",
			cross_bg: "#444444",
			cross_hover: "#882222",
			cross_icon_hover: "#ffaaaa",
			text_main: "white",
			text_accent: "yellow",
			text_dim: "rgba(255,255,255,0.7)",
			popup_bg: "black",
			popup_border: "gray",
			question_mark: "#555555",
			palette: {
				cyan: "cyan",
				purple: "purple",
				orange: "orange",
				blue_light: "#1177dd",
				blue_bright: "#1177ff",
				green_dark: "#335544",
				red_bright: "#cc1111",
				gold: "#ffcc00",
				tan: "#c2a26b",
				brown_dark: "#4d3d21",
				brown_mid: "#884411",
				brown_light: "#aa6622",
				red_orange: "#ff4422",
				gray_dark: "#333333",
				gray_mid: "#4d4d4d",
				gray_light: "#626262",
				gray_very_dark: "#111111",
				gray_silver: "#c2c2c2",
				gray_text: "#777777",
				black_soft: "#222222"
			}
		}
	},
	decorations: {
		nature: {
			grass: "#117711",
			sand: "#bbaa55",
			tree_leaves: "lime",
			tree_leaves_outline: "#224400",
			tree_trunk: "brown",
			tree_trunk_outline: "#442200",
			cactus_body: "#33aa33",
			cactus_outline: "#114411",
			cactus_branch: "#2a882a",
			cactus_flower: "#ff66aa",
			fountain_base: "#777777",
			fountain_water: "#3366ff"
		},
		city: {
			road: "#222222",
			road_marking: "#ffffff",
			wall_default: "#333333",
			wall_outline: "#222222",
			building_fill: "#555555",
			hospital_accent: "#1177ff",
			hospital_walls: "#ffffff",
			hospital_roof: "#eeeeee",
			hospital_roof_outline: "#bbbbbb",
			police_accent: "#222266",
			police_roof: "#111144",
			police_roof_outline: "#000022",
			fire_accent: "#992222",
			fire_roof: "#771111",
			fire_roof_outline: "#440000",
			bench_options: ["SaddleBrown", "Sienna", "RosyBrown",
				"FireBrick", "Peru", "Chocolate", "Maroon"
			]
		},
		objects: {
			fuel_base: "#DDDDDD",
			fuel_92: "#FFCC00",
			fuel_98: "#00FF00",
			fuel_80: "#0088FF",
			fuel_display: "#111111",
			hotdog_body: "#ffcc00",
			hotdog_stripe_red: "#ff0000",
			hotdog_stripe_white: "#ffffff",
			hotdog_window: "red"
		}
	}
};