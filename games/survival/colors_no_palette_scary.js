
let COLORS_SCHEME_DEFAULT_NO_PALETTE_SCARY = {
	trashcan: {
		fill: "#1a1a1a",
		stroke: "#000000"
	},
	rocket: {
		health_bg: "#220000",
		health_fill: "#660000",
		wings: "#4a0000",
		color: "#2d2d2d"
	},
	cars: {
		types: {
			default: {
				body: "#1c1c1c",
				outline: "#050505"
			},
			police: {
				body: "#0a0a0a",
				stripe: "#1a2a44",
				line: "#444444",
				siren_alt: "#220066"
			},
			fireman: {
				body: "#4a0000",
				ladder: "#333333",
				siren_alt: "#662200"
			},
			ambulance: {
				body: "#2a2a2a",
				stripe: "#4a0000",
				siren_alt: "#440000"
			},
			taxi: {
				body: "#554400",
				checkers: "#000000",
				sign_bg: "#000000",
				sign_text: "#aa8800"
			}
		},
		common: {
			outline: "#000000",
			shadow: "rgba(0, 0, 0, 0.7)",
			glass: "#1a2a33",
			glass_outline: "#000000",
			glass_reflection: "rgba(100, 100, 100, 0.2)",
			wheels: "#050505",
			siren_red: "#660000"
		},
		tank: {
			tracks: "#0f0f0f",
			track_lines: "#1a1a1a",
			barrel: "#151515",
			muzzle: "#000000"
		},
		ui: {
			health_bg: "#330000",
			health_fill: "#880000",
			fuel_bg: "#222200",
			fuel_fill: "#444422"
		}
	},
	bullets: {
		default_fill: "#666600",
		default_outline: "#333300",
	},
	player: {
		red: "#660000",
		blue: "#000066",
		yellow: "#666600",
		lime: "#004400",
		hair_default: "#1a0f00",
		skin: "#6b6254",
		eye_white: "#999999",
		eye_iris: "#ff0000",
		shoes: "#0a0a0a",
		arm_sleeve: "#111111",
		arm_hand: "#4a443a",
		outline: "#000000",
		laser_glow: "#ff0000",
		shield_blue_fill: "#0a2a44",
		shield_blue_stroke: "#001122",
		indicator_bg: "#220000",
		indicator_health: "#660000",
		indicator_thirst: "#1a3a4a",
		indicator_hunger: "#4a3300",
		indicator_shield_bg: "#111111"
	},
	enemies: {
		regular: {
			body: "#2d3322",
			outline: "#000000",
			eye: "#ff0000"
		},
		shooting: {
			body: "#1a221a",
			outline: "#000000",
			eye: "#ff0000",
			gun: "#0a0a0a",
			bullet_fill: "#440000",
			bullet_outline: "#000000"
		},
		desert: {
			body: "#4a3d21",
			outline: "#221a0a",
			eye: "#ff0000",
			gun: "#111111",
			bullet_fill: "#331100",
			bullet_outline: "#000000"
		},
		shooting_red: {
			body: "#333333",
			outline: "#440000",
			eye: "#ffcc00",
			gun: "#1a0000",
			bullet_main: "#660000",
			bullet_alt: "#330000"
		},
		sword: {
			body: "#444411",
			outline: "#1a3300",
			eye: "#ff0000",
			sword: "#1a3300",
			bullet_fill: "#222222",
			bullet_outline: "#002200"
		},
		mummy: {
			body: "#4a443a",
			outline: "#221f1a",
			eye: "#004466",
			gun: "#1a2a33",
			bandage_shadow: "rgba(0, 0, 0, 0.5)",
			glow: "#003344"
		},
		rocket: {
			body: "#222222",
			outline: "#000000",
			eye: "#ffcc00",
			gun: "#0a1a2a"
		},
		shadow: {
			body: "rgba(0, 0, 0, 0.9)",
			body_icon: "#111111",
			outline: "#222222",
			eye: "#330044",
			bullet_fill: "#1a0044",
			bullet_outline: "#000000"
		},
		anubis: {
			body: "#050505",
			outline: "#443300",
			eye: "#666600",
			gun: "#332200",
			cloth_alt: "#001133",
			bullet_fill: "#441100",
			bullet_outline: "#220a00",
			stream_fill: "#331a00",
			stream_outline: "#000000"
		},
		laser: {
			body_fallback: "#000000",
			outline: "#333333",
			eye: "#660000",
			gun: "#1a0a1a",
			rainbow: ["#440000", "#442200", "#444400", "#004400", "#004444", "#000044", "#220044"]
		},
		deer_boss: {
			body: "#2a1a0a",
			outline: "#1a0f05",
			eye: "#660000"
		},
		raccoon_boss: {
			body: "#1a1a1a",
			outline: "#440000",
			eye: "#660000",
			trash_bullet: "#222222"
		},
		scorpion_boss: {
			body: "#050505",
			eye: "#660000",
			venom_bullet: "#003300"
		},
		snake_boss: {
			body: "#0a0a0a",
			outline: "#003311",
			eye: "#660000",
			venom_stream: "#004411",
			venom_outline: "#000000"
		}
	},
	entities: {
		animals: {
			deer: {
				main: "#2a1a0a",
				dark: "#0f0a05",
				light: "#3a2f24",
				horn: "#3a332a",
				hoof: "#000000",
				eye_bg: "#111111",
				eye_pupil: "#ff0000",
				nose: "#000000"
			},
			raccoon: {
				body: "#2a2a2a",
				outline: "#0a0a0a",
				ears: "#1a1a1a",
				mask: "#050505",
				eye_white: "#666666",
				eye_pupil: "#ff0000",
				nose: "#000000",
				tail_stripes: ["#0a0a0a", "#1a1a1a"]
			},
			snake: {
				body: "#050505",
				eye: "#660000"
			},
			scorpion: {
				dark: "#050505",
				mid: "#111111",
				light: "#1a1a1a",
				eye: "#660000",
				eye_shadow: "#330000"
			},
			bosses: {
				raccoon: {
					ears: "#0a0a0a",
					body: "#1a1a1a",
					mask: "#000000",
					eye: "#660000",
					eye_shadow: "#330000",
					mouth: "#111111",
					tail_stripes: ["#050505", "#111111"]
				},
				deer: {
					dark: "#0a0500",
					horn: "#2a251a",
					hoof: "#000000",
					eye_pupil: "#ff0000"
				}
			}
		},
		indicators: {
			health_bg: "#220000",
			health_fill: "#660000",
			hunger_bg: "#221100",
			hunger_fill: "#442200"
		}
	},
	items: {
		cactus_juice: {
			liquid: "#1a331a",
			bottle: "#33331a",
			label: "#0a1a0a",
			spike: "#000000"
		},
		money: {
			fill: "#1a331a",
			stroke: "#0a1a0a",
			icon: "#000000"
		},
		apple_core: {
			body: "#333322",
			bit: "#330000",
			stick: "#1a0f00"
		},
		fish_bone: {
			color: "#555555"
		},
		bottle: {
			body: "rgba(50, 70, 90, 0.4)",
			stroke: "#333333"
		},
		can: {
			body: "#333333",
			stripe: "#222222",
			inside: "#111111",
			reflection: "#444444",
			lid: "#2a2a2a"
		},
		shoe: {
			body: "#1a130a"
		},
		fork: {
			color: "#333333"
		},
		crumpled_paper: {
			body: "#333333",
			stroke: "#1a1a1a",
			line: "#222222"
		},
		battery: {
			body: "#222222",
			bottom: "#0a0a0a",
			tip: "#333333",
			minus: "#111111"
		},
		diary: {
			cover: "#2a1a15",
			spine: "#1a0f0a",
			lines: "#4a3f3a"
		},
		note: {
			paper: "#2a2a2a",
			border: "#1a1a1a",
			text: "#000000"
		},
		unknown: {
			bg: "#000000",
			accent: "#330033"
		},
		venom_vial: {
			cork: "#1a0f05",
			glass: "rgba(40, 40, 40, 0.5)",
			glass_outline: "#1a1a1a",
			liquid_base: [0, 40, 0],
			liquid_pulse: 10,
			skull: "#444444",
			eyes: "#000000",
			reflection: "rgba(255, 255, 255, 0.05)"
		},
		ammo_standard: {
			main: "#444400",
			tip: "#332200",
			outline: "#1a1400"
		},
		ammo_plasma: {
			main: "#004444",
			tip: "#002244",
			outline: "#001111"
		},
		ammo_red_plasma: {
			main: "#440000",
			tip: "#220000",
			outline: "#110000"
		},
		ammo_corrosive: {
			main: "#1a4400",
			tip: "#0a2200",
			outline: "#051100"
		},
		ammo_rocket: {
			main: "#1a1a1a",
			tip: "#440000",
			outline: "#000000"
		},
		ammo_rainbow: {
			mains: ["#442222", "#444422", "#224422", "#222244"],
			tips: ["#220000", "#222200", "#002200", "#000022"],
			outline: "#000000"
		},
		health_kit: {
			bg: "#1a1a1a",
			icon: "#440000",
			stroke: "#000000"
		},
		health_kit_adv: {
			bg: "#1a1a1a",
			icon: "#003311",
			stroke: "#000000"
		},
		fuel: {
			body: "#440000",
			shadow: "#220000",
			accent: "#330000",
			cap: "#333300",
			outline: "#000000"
		},
		canned_meat: {
			body: "#2a2a2a",
			label: "#330000"
		},
		water: {
			bottle: "#222222",
			liquid: "#0a1a33"
		},
		cola: {
			bottle: "#222222",
			liquid: "#330000"
		},
		milk: {
			top: "#0a1a33",
			bottom: "#2a2a2a",
			outline: "#000000"
		},
		chocolate: {
			dark: "#1a0a00",
			wrapper: "#330000",
			border: "#0a0500",
			gold: "#443300"
		},
		orange: {
			skin: "#442200",
			shadow: "#1a0f00",
			light: "#553311",
			stem: "#1a0f00"
		},
		apple: {
			skin: "#440000",
			shadow: "#1a0000",
			stem: "#1a0f00",
			leaf: "#112200",
			light: "rgba(100, 100, 100, 0.2)"
		},
		cherries: {
			stem: "#0a1a00",
			fruit1: "#330000",
			fruit2: "#440000",
			shadow: "#1a0000",
			light: "#666666"
		},
		chicken: {
			bone: "#333333",
			bone_shadow: "#1a1a1a",
			meat_dark: "#331a0a",
			meat_light: "#442211"
		},
		shield_energy: {
			fill: "#002233",
			outline: "#004466"
		},
		shield_kinetic: {
			fill: "#112200",
			outline: "#224400"
		},
		shield_shadow: {
			fill: "#05000a",
			outline: "#1a0033"
		},
		aegis: {
			body: "#330000",
			gold: "#443300"
		},
		bossifier: {
			bg: "#000000"
		}
	},
	weapons: {
		common: {
			metal: "#1a1a1a",
			metal_light: "#2a2a2a",
			metal_dark: "#0a0a0a",
			silver: "#444444",
			silver_light: "#555555",
			silver_dark: "#2a2a2a",
			silver_bright: "#666666",
			wood: "#2a1a0f",
			wood_dark: "#1a0f0a",
			wood_alt: "#22140a",
			black: "#000000",
			black_soft: "#0a0a0a",
			gray: "#333333",
			gray_dark: "#1a1a1a",
			white_transp: "rgba(0,0,0,0.5)",
			white_gloss: "rgba(50, 50, 50, 0.2)"
		},
		venom: {
			liquid_base: [0, 50, 0],
			liquid_pulse: 30,
			liquid_smg_base: [0, 40, 0],
			liquid_smg_pulse: 20,
			vial_bg: "rgba(0, 30, 0, 0.3)",
			tentacle: "#0a3311",
			dark: "#051105",
			acid: "#1a4400",
			mid: "#0a220a"
		},
		energy: {
			plasma: "#003344",
			plasma_dark: "#1a0a1a",
			plasma_vdark: "#0a000a",
			soul_bg: "#3a2f24",
			soul_outline: "#1a0f0a",
			soul_glow: "#004444",
			void_body: "#0a050f",
			void_glow: "rgba(50, 0, 80, 0.6)",
			void_core: "#1a0044",
			void_accent: "#330033",
			void_vdark: "#05050a",
			void_purple: "#110022",
			laser_main: "#330044",
			laser_accent: "#440044",
			laser_line: "#666666",
		},
		special: {
			mummy_pistol: "#3a2f24",
			mummy_bullet: "#003344",
			mummy_bullet_outline: "#000000",
			shadow_staff: "#0a050f",
			shadow_bullet: "#1a0044",
			shadow_dual: "#05050a",
			shadow_dual_bullet: "#220044",
			anubis_punisher: "#332a00",
			anubis_bullet_red: "#440000",
			anubis_bullet_gold: "#332200",
			snake_staff: "#0a0a05",
			snake_bullet: "#004411",
			snake_bullet_alt: "#334400",
			venom_dual: "#0a1a0a",
			venom_shotgun: "#0a1f0a",
			acid_smg: "#1a2a1a",
			acid_bullet: "#003300",
			acid_bullet_dark: "#001a00",
			stone_bullet: "#2a2a2a",
			stone_bullet_outline: "#0a0a0a",
			kalashnikov: "#1a1a1a",
			kalash_bullet: "#443300",
			green_gun: "#0a220a",
			rainbow_white: "#333333",
			red_main: "#440000",
			red_glow: "#220000",
			rocket_body: "#0a0a1a",
			rocket_eye: "#440000",
			rocket_alt: "#331a00",
			minigun_blue: "#0a1a33",
			minigun_blue_light: "#1a2a44",
			minigun_blue_dark: "#050a1a",
			junk_body: "#1a1a1a",
			junk_alt: "#1a222a",
			junk_stroke: "#000033",
			stone_stroke: "#1a1a1a",
			stick_main: "#2a1a0f",
			stick_stroke: "#1a0f0a",
			sword_blade: "#1a3305",
			sword_stroke: "#333305",
			sword_handle: "#1a0f05",
			sword_guard: "#0f0a05",
			sword_lines: "rgba(0,0,0,0.6)",
			anubis_gold: "#332a00",
			anubis_orange: "#331a00",
			anubis_orange_transp: "rgba(51, 26, 0, 0.6)"
		}
	},
	ui: {
		hotbar: {
			cell_bg: "#0a0a1a",
			cell_selected: "#002a33",
			button_bg: "#1a1a33",
			button_hover: "#2a2a44",
			button_outline: "#000000",
			indicator_outline: "rgba(0,0,0,0.6)",
			tooltip_bg: "#050505",
			tooltip_border: "#1a1a1a",
			tooltip_title: "#444400",
			tooltip_text: "#444444",
			resources: {
				hunger_empty: "#1a0a00",
				hunger_full: "#442200",
				thirst_empty: "#000a1a",
				thirst_full: "#0a2a44",
				health_empty: "#1a0000",
				health_full: "#330000",
				shield_empty: "#0a0a0a",
				shield_default: "#002222"
			},
			icons: {
				inv_bag: "#2a0a0a",
				inv_flap: "#1a0f0a",
				inv_buckle: "#2a2200",
				ach_cup: "#332a00",
				ach_outline: "#221100"
			}
		},
		inventory: {
			cell_bg: "#0a0a1a",
			cell_selected: "#002a33",
			cell_move: "#331a00",
			cell_hotbar_outline: "#001a1a",
			close_bg: "#1a1a1a",
			close_hover: "#330000",
			close_icon: "#444444",
			close_icon_hover: "#660000",
			btn_use: "#0a220a",
			btn_drop: "#220a0a",
			btn_text: "#444444",
			btn_outline: "#000000",
			popup_bg: "#050505",
			popup_border: "#1a1a1a",
			popup_title: "#444400",
			popup_text: "#333333"
		},
		achievements: {
			bg: "#000000",
			border: "#1a1a1a",
			cross_bg: "#111111",
			cross_hover: "#220000",
			cross_icon_hover: "#440000",
			text_main: "#444444",
			text_accent: "#444400",
			text_dim: "rgba(68,68,68,0.7)",
			popup_bg: "#050505",
			popup_border: "#111111",
			question_mark: "#1a1a1a",
			palette: {
				cyan: "#002222",
				purple: "#220022",
				orange: "#221100",
				blue_light: "#0a1a2a",
				blue_bright: "#0a2a44",
				green_dark: "#0a1a0a",
				red_bright: "#330000",
				gold: "#332a00",
				tan: "#3a2f24",
				brown_dark: "#1a0f0a",
				brown_mid: "#2a1a0f",
				brown_light: "#3a2a1a",
				red_orange: "#330a00",
				gray_dark: "#0a0a0a",
				gray_mid: "#1a1a1a",
				gray_light: "#2a2a2a",
				gray_very_dark: "#050505",
				gray_silver: "#333333",
				gray_text: "#222222",
				black_soft: "#0a0a0a"
			}
		}
	},
	decorations: {
		nature: {
			grass: "#0a1a0a",
			sand: "#2a251a",
			tree_leaves: "#0a1f0a",
			tree_leaves_outline: "#050a05",
			tree_trunk: "#1a0f0a",
			tree_trunk_outline: "#0a0500",
			cactus_body: "#0a1a0a",
			cactus_outline: "#000000",
			cactus_branch: "#0a140a",
			cactus_flower: "#33001a",
			fountain_base: "#1a1a1a",
			fountain_water: "#0a1a2a"
		},
		city: {
			road: "#0a0a0a",
			road_marking: "#333333",
			wall_default: "#1a1a1a",
			wall_outline: "#0a0a0a",
			building_fill: "#151515",
			hospital_accent: "#0a1a33",
			hospital_walls: "#1a1a1a",
			hospital_roof: "#111111",
			hospital_roof_outline: "#0a0a0a",
			police_accent: "#0a0a1a",
			police_roof: "#05050f",
			police_roof_outline: "#000000",
			fire_accent: "#1a0505",
			fire_roof: "#110000",
			fire_roof_outline: "#050000",
			bench_options: ["#1a0f0a", "#150a05", "#1a0a0a", "#1a0000", "#1a140a", "#1a0f00", "#0a0000"]
		},
		objects: {
			fuel_base: "#1a1a1a",
			fuel_92: "#2a2200",
			fuel_98: "#0a220a",
			fuel_80: "#0a1a2a",
			fuel_display: "#000000",
			hotdog_body: "#2a2200",
			hotdog_stripe_red: "#330000",
			hotdog_stripe_white: "#2a2a2a",
			hotdog_window: "#1a0000"
		}
	}
};
