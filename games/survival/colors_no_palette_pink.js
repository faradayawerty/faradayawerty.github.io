let COLORS_SCHEME_DEFAULT_NO_PALETTE_PINK = {
	trashcan: {
		fill: "#ff85d2",
		stroke: "#ff4db8"
	},
	rocket: {
		health_bg: "#ffb3d9",
		health_fill: "#ffffff",
		wings: "#ff0095",
		color: "#ffe6f2"
	},
	cars: {
		types: {
			default: {
				body: "#ffcce6",
				outline: "#ff3399"
			},
			police: {
				body: "#ff66b2",
				stripe: "#ffffff",
				line: "#ff99cc",
				siren_alt: "#ff00ff"
			},
			fireman: {
				body: "#ff1493",
				ladder: "#fff0f5",
				siren_alt: "#ffccff"
			},
			ambulance: {
				body: "#fff5f8",
				stripe: "#ff69b4",
				siren_alt: "#ff00cc"
			},
			taxi: {
				body: "#ffe0f0",
				checkers: "#ff0099",
				sign_bg: "#ff0099",
				sign_text: "#ffffff"
			}
		},
		common: {
			outline: "#ff3399",
			shadow: "rgba(255, 105, 180, 0.3)",
			glass: "#fdf4ff",
			glass_outline: "#ff66b2",
			glass_reflection: "rgba(255, 255, 255, 0.8)",
			wheels: "#ff4da6",
			siren_red: "#ff0066"
		},
		tank: {
			tracks: "#ff99cc",
			track_lines: "#ff66b2",
			barrel: "#ff80bf",
			muzzle: "#ff1493"
		},
		ui: {
			health_bg: "#ffb3d9",
			health_fill: "#ffffff",
			fuel_bg: "#ff66b2",
			fuel_fill: "#ffe6f2"
		}
	},
	bullets: {
		default_fill: "#ffffff",
		default_outline: "#ff00ff",
	},
	player: {
		red: "#ff0099",
		blue: "#ff99ff",
		yellow: "#fff0f5",
		lime: "#ffffff",
		hair_default: "#fff9c4",
		skin: "#ffe4e1",
		eye_white: "white",
		eye_iris: "#ff66b2",
		shoes: "#ff1493",
		arm_sleeve: "#ffcce6",
		arm_hand: "#ffe4e1",
		outline: "#ff0095",
		laser_glow: "#ffffff",
		shield_blue_fill: "#ffb3e6",
		shield_blue_stroke: "#ff00ff",
		indicator_bg: "#ffccf2",
		indicator_health: "#ffffff",
		indicator_thirst: "#f0f8ff",
		indicator_hunger: "#fff5ee",
		indicator_shield_bg: "#ffebf5"
	},
	enemies: {
		regular: {
			body: "#ff80bf",
			outline: "#ffffff",
			eye: "#ffffff"
		},
		shooting: {
			body: "#ff66b2",
			outline: "#ffffff",
			eye: "#ff00ff",
			gun: "#ffcce6",
			bullet_fill: "#ffffff",
			bullet_outline: "#ff00cc"
		},
		desert: {
			body: "#ffb3d9",
			outline: "#ff1493",
			eye: "#ffffff",
			gun: "#ff80bf",
			bullet_fill: "#ffffff",
			bullet_outline: "#ff0099"
		},
		shooting_red: {
			body: "#ffccf2",
			outline: "#ff00ff",
			eye: "#ffffff",
			gun: "#ff66b2",
			bullet_main: "#ffffff",
			bullet_alt: "#ff0066"
		},
		sword: {
			body: "#ff99cc",
			outline: "#ffffff",
			eye: "#ff00ff",
			sword: "#ff1493",
			bullet_fill: "#fff0f5",
			bullet_outline: "#ff3399"
		},
		mummy: {
			body: "#ffe6f2",
			outline: "#ff80bf",
			eye: "#ffffff",
			gun: "#ffccf2",
			bandage_shadow: "rgba(255, 182, 193, 0.5)",
			glow: "#ffffff"
		},
		rocket: {
			body: "#ffcce6",
			outline: "#ff00ff",
			eye: "#ffffff",
			gun: "#ff1493"
		},
		shadow: {
			body: "rgba(255, 20, 147, 0.4)",
			body_icon: "#ffffff",
			outline: "#ffffff",
			eye: "#ffffff",
			bullet_fill: "#ffccff",
			bullet_outline: "#ff00ff"
		},
		anubis: {
			body: "#ff66b2",
			outline: "#ffffff",
			eye: "#ffffff",
			gun: "#ff1493",
			cloth_alt: "#ffccf2",
			bullet_fill: "#ffffff",
			bullet_outline: "#ff0099",
			stream_fill: "#ffccff",
			stream_outline: "#ffffff"
		},
		laser: {
			body_fallback: "#ffcce6",
			outline: "#ffffff",
			eye: "#ffffff",
			gun: "#ff00ff",
			rainbow: ["#ff00ff", "#ff66b2", "#ffb3d9", "#ffffff", "#ffccf2",
				"#ff1493",
				"#ff0099"
			]
		},
		deer_boss: {
			body: "#ff80bf",
			outline: "#ffffff",
			eye: "#ff00ff"
		},
		raccoon_boss: {
			body: "#ff99cc",
			outline: "#ff00ff",
			eye: "#ffffff",
			trash_bullet: "#ffccf2"
		},
		scorpion_boss: {
			body: "#ff66b2",
			eye: "#ffffff",
			venom_bullet: "#ffffff"
		},
		snake_boss: {
			body: "#ffcce6",
			outline: "#ffffff",
			eye: "#ff00ff",
			venom_stream: "#ffffff",
			venom_outline: "#ff00ff"
		}
	},
	entities: {
		animals: {
			deer: {
				main: "#ffcce6",
				dark: "#ff80bf",
				light: "#ffe6f2",
				horn: "#ffffff",
				hoof: "#ff1493",
				eye_bg: "#ffffff",
				eye_pupil: "#ff00ff",
				nose: "#ff66b2"
			},
			raccoon: {
				body: "#ffb3d9",
				outline: "#ff66b2",
				ears: "#ff80bf",
				mask: "#ff1493",
				eye_white: "white",
				eye_pupil: "#ff00ff",
				nose: "#ff3399",
				tail_stripes: ["#ffcce6", "#ff66b2"]
			},
			snake: {
				body: "#ff80bf",
				eye: "#ffffff"
			},
			scorpion: {
				dark: "#ff1493",
				mid: "#ff66b2",
				light: "#ffb3d9",
				eye: "#ffffff",
				eye_shadow: "#ff00ff"
			},
			bosses: {
				raccoon: {
					ears: "#ff66b2",
					body: "#ff99cc",
					mask: "#ff1493",
					eye: "#ffffff",
					eye_shadow: "#ff00ff",
					mouth: "white",
					tail_stripes: ["#ffcce6", "#ff80bf"]
				},
				deer: {
					dark: "#ff66b2",
					horn: "#ffffff",
					hoof: "#ff1493",
					eye_pupil: "#ff00ff"
				}
			}
		},
		indicators: {
			health_bg: "#ffccf2",
			health_fill: "#ffffff",
			hunger_bg: "#ffccf2",
			hunger_fill: "#fff0f5"
		}
	},
	items: {
		cactus_juice: {
			liquid: "#ffccff",
			bottle: "#fff0f5",
			label: "#ff00ff",
			spike: "#ff66b2"
		},
		money: {
			fill: "#ffffff",
			stroke: "#ff00ff",
			icon: "#ff00ff"
		},
		apple_core: {
			body: "#fff5f8",
			bit: "#ff1493",
			stick: "#ffb3d9"
		},
		fish_bone: {
			color: "#ffe6f2"
		},
		bottle: {
			body: "rgba(255, 192, 203, 0.4)",
			stroke: "white"
		},
		can: {
			body: "#ffccf2",
			stripe: "#ffb3d9",
			inside: "#ff80bf",
			reflection: "#ffffff",
			lid: "#ffcce6"
		},
		shoe: {
			body: "#ff66b2"
		},
		fork: {
			color: "#ffcce6"
		},
		crumpled_paper: {
			body: "#ffffff",
			stroke: "#ffccf2",
			line: "#ffb3d9"
		},
		battery: {
			body: "#ff80bf",
			bottom: "#ff66b2",
			tip: "#ffccf2",
			minus: "#ff1493"
		},
		diary: {
			cover: "#ff66b2",
			spine: "#ff1493",
			lines: "#fff0f5"
		},
		note: {
			paper: "#fffafa",
			border: "#ffcce6",
			text: "#ff00ff"
		},
		unknown: {
			bg: "#ffcce6",
			accent: "#ff00ff"
		},
		venom_vial: {
			cork: "#ff80bf",
			glass: "rgba(255, 240, 245, 0.3)",
			glass_outline: "#ffffff",
			liquid_base: [255, 105, 180],
			liquid_pulse: 50,
			skull: "#fff",
			eyes: "#ff00ff",
			reflection: "rgba(255, 255, 255, 0.5)"
		},
		ammo_standard: {
			main: "#ffffff",
			tip: "#ff00ff",
			outline: "#ff66b2"
		},
		ammo_plasma: {
			main: "#ffccff",
			tip: "#ff00ff",
			outline: "white"
		},
		ammo_red_plasma: {
			main: "#ffb3d9",
			tip: "#ff1493",
			outline: "#ff1493"
		},
		ammo_corrosive: {
			main: "#ffe6f2",
			tip: "#ff66b2",
			outline: "#ff66b2"
		},
		ammo_rocket: {
			main: "#ffccf2",
			tip: "#ff0099",
			outline: "#ff1493"
		},
		ammo_rainbow: {
			mains: ["#ffffff", "#ffccf2", "#ffb3d9", "#ffccff"],
			tips: ["#ff00ff", "#ff1493", "#ff66b2", "#ff0099"],
			outline: "white"
		},
		health_kit: {
			bg: "white",
			icon: "#ff00ff",
			stroke: "#ff00ff"
		},
		health_kit_adv: {
			bg: "white",
			icon: "#ff1493",
			stroke: "#ff1493"
		},
		fuel: {
			body: "#ff66b2",
			shadow: "#ff1493",
			accent: "#ff80bf",
			cap: "#ffffff",
			outline: "#ff0099"
		},
		canned_meat: {
			body: "#ffccf2",
			label: "#ff00ff"
		},
		water: {
			bottle: "#ffcce6",
			liquid: "#ffffff"
		},
		cola: {
			bottle: "#ffcce6",
			liquid: "#ff1493"
		},
		milk: {
			top: "#ff66b2",
			bottom: "#fff5f8",
			outline: "#ff00ff"
		},
		chocolate: {
			dark: "#ff80bf",
			wrapper: "#ff1493",
			border: "#ff00ff",
			gold: "#ffffff"
		},
		orange: {
			skin: "#ffb3d9",
			shadow: "#ff66b2",
			light: "#ffe6f2",
			stem: "#ff1493"
		},
		apple: {
			skin: "#ff69b4",
			shadow: "#ff1493",
			stem: "#ffb3d9",
			leaf: "#ffffff",
			light: "rgba(255, 255, 255, 0.8)"
		},
		cherries: {
			stem: "#ffcce6",
			fruit1: "#ff0099",
			fruit2: "#ff66b2",
			shadow: "#ff1493",
			light: "white"
		},
		chicken: {
			bone: "#ffffff",
			bone_shadow: "#ffccf2",
			meat_dark: "#ff80bf",
			meat_light: "#ffb3d9"
		},
		shield_energy: {
			fill: "#ffccff",
			outline: "white"
		},
		shield_kinetic: {
			fill: "#ffe6f2",
			outline: "white"
		},
		shield_shadow: {
			fill: "#ff1493",
			outline: "#ffffff"
		},
		aegis: {
			body: "#ff00ff",
			gold: "#ffffff"
		},
		bossifier: {
			bg: "#ff1493"
		}
	},
	weapons: {
		common: {
			metal: "#ffcce6",
			metal_light: "#ffebf5",
			metal_dark: "#ff99cc",
			silver: "#ffccf2",
			silver_light: "#ffffff",
			silver_dark: "#ffb3d9",
			silver_bright: "#fff0f5",
			wood: "#ff80bf",
			wood_dark: "#ff66b2",
			wood_alt: "#ff4da6",
			black: "#ff0099",
			black_soft: "#ff1493",
			gray: "#ffb3d9",
			gray_dark: "#ff66b2",
			white_transp: "rgba(255,255,255,0.4)",
			white_gloss: "rgba(255, 255, 255, 0.6)"
		},
		venom: {
			liquid_base: [255, 182, 193],
			liquid_pulse: 100,
			liquid_smg_base: [255, 20, 147],
			liquid_smg_pulse: 120,
			vial_bg: "rgba(255, 105, 180, 0.2)",
			tentacle: "#ff80bf",
			dark: "#ff1493",
			acid: "#ffffff",
			mid: "#ff66b2"
		},
		energy: {
			plasma: "#ffffff",
			plasma_dark: "#ff00ff",
			plasma_vdark: "#ff1493",
			soul_bg: "#ffe4e1",
			soul_outline: "#ffb3d9",
			soul_glow: "#ffffff",
			void_body: "#ff1493",
			void_glow: "rgba(255, 255, 255, 0.6)",
			void_core: "#ffffff",
			void_accent: "#ff00ff",
			void_vdark: "#ff0099",
			void_purple: "#ff66b2",
			laser_main: "#ff00ff",
			laser_accent: "#ffccf2",
			laser_line: "white",
		},
		special: {
			mummy_pistol: "#ffe6f2",
			mummy_bullet: "#ffffff",
			mummy_bullet_outline: "#ff00ff",
			shadow_staff: "#ff1493",
			shadow_bullet: "#ffffff",
			shadow_dual: "#ff0099",
			shadow_dual_bullet: "#ffccff",
			anubis_punisher: "#ffffff",
			anubis_bullet_red: "#ff0099",
			anubis_bullet_gold: "#ffccf2",
			snake_staff: "#ff80bf",
			snake_bullet: "#ffffff",
			snake_bullet_alt: "#ffccff",
			venom_dual: "#ff66b2",
			venom_shotgun: "#ff80bf",
			acid_smg: "#ffb3d9",
			acid_bullet: "#ffffff",
			acid_bullet_dark: "#ff00ff",
			stone_bullet: "#ffccf2",
			stone_bullet_outline: "#ff66b2",
			kalashnikov: "#ff99cc",
			kalash_bullet: "#ffffff",
			green_gun: "#ff66b2",
			rainbow_white: "white",
			red_main: "#ff1493",
			red_glow: "#ff00ff",
			rocket_body: "#ff66b2",
			rocket_eye: "#ffffff",
			rocket_alt: "#ffb3d9",
			minigun_blue: "#ff99cc",
			minigun_blue_light: "#ffccf2",
			minigun_blue_dark: "#ff66b2",
			junk_body: "#ffcce6",
			junk_alt: "#ffb3d9",
			junk_stroke: "#ff00ff",
			stone_stroke: "#ff80bf",
			stick_main: "#ffb3d9",
			stick_stroke: "#ff80bf",
			sword_blade: "#ffffff",
			sword_stroke: "#ff00ff",
			sword_handle: "#ff66b2",
			sword_guard: "#ff1493",
			sword_lines: "rgba(255,255,255,0.5)",
			anubis_gold: "#ffffff",
			anubis_orange: "#ffccf2",
			anubis_orange_transp: "rgba(255, 204, 242, 0.6)"
		}
	},
	ui: {
		hotbar: {
			cell_bg: "#ffcce6",
			cell_selected: "#ffffff",
			button_bg: "#ff80bf",
			button_hover: "#ffb3d9",
			button_outline: "#ffffff",
			indicator_outline: "rgba(255,255,255,0.6)",
			tooltip_bg: "#ff1493",
			tooltip_border: "#ffffff",
			tooltip_title: "#ffffff",
			tooltip_text: "#fff0f5",
			resources: {
				hunger_empty: "#ffb3d9",
				hunger_full: "#ffffff",
				thirst_empty: "#ffccf2",
				thirst_full: "#ffffff",
				health_empty: "#ff66b2",
				health_full: "#ffffff",
				shield_empty: "#ffcce6",
				shield_default: "#ffffff"
			},
			icons: {
				inv_bag: "#ff66b2",
				inv_flap: "#ff80bf",
				inv_buckle: "#ffffff",
				ach_cup: "#ffffff",
				ach_outline: "#ff00ff"
			}
		},
		inventory: {
			cell_bg: "#ffcce6",
			cell_selected: "#ffffff",
			cell_move: "#ff00ff",
			cell_hotbar_outline: "#ffffff",
			close_bg: "#ff66b2",
			close_hover: "#ff1493",
			close_icon: "white",
			close_icon_hover: "#fff0f5",
			btn_use: "#ff80bf",
			btn_drop: "#ff1493",
			btn_text: "white",
			btn_outline: "white",
			popup_bg: "#ff66b2",
			popup_border: "#ffffff",
			popup_title: "#ffffff",
			popup_text: "#fff0f5"
		},
		achievements: {
			bg: "#ff80bf",
			border: "white",
			cross_bg: "#ff66b2",
			cross_hover: "#ff1493",
			cross_icon_hover: "#ffffff",
			text_main: "white",
			text_accent: "#fff0f5",
			text_dim: "rgba(255,255,255,0.8)",
			popup_bg: "#ff66b2",
			popup_border: "white",
			question_mark: "#ffcce6",
			palette: {
				cyan: "#ffffff",
				purple: "#ff00ff",
				orange: "#ffe6f2",
				blue_light: "#ffccf2",
				blue_bright: "#ffebf5",
				green_dark: "#ff66b2",
				red_bright: "#ff1493",
				gold: "#ffffff",
				tan: "#ffb3d9",
				brown_dark: "#ff80bf",
				brown_mid: "#ff66b2",
				brown_light: "#ffcce6",
				red_orange: "#ff0099",
				gray_dark: "#ff80bf",
				gray_mid: "#ff99cc",
				gray_light: "#ffcce6",
				gray_very_dark: "#ff1493",
				gray_silver: "#ffe6f2",
				gray_text: "#ffffff",
				black_soft: "#ff00ff"
			}
		}
	},
	decorations: {
		nature: {
			grass: "#ffcce6",
			sand: "#fff0f5",
			tree_leaves: "#ff80bf",
			tree_leaves_outline: "#ffffff",
			tree_trunk: "#ffb3d9",
			tree_trunk_outline: "#ff66b2",
			cactus_body: "#ff99cc",
			cactus_outline: "#ff1493",
			cactus_branch: "#ffb3d9",
			cactus_flower: "#ffffff",
			fountain_base: "#ffccf2",
			fountain_water: "#ffffff"
		},
		city: {
			road: "#ffccf2",
			road_marking: "#ffffff",
			wall_default: "#ffb3d9",
			wall_outline: "#ff66b2",
			building_fill: "#ffcce6",
			hospital_accent: "#ffffff",
			hospital_walls: "#fff5f8",
			hospital_roof: "#ffccf2",
			hospital_roof_outline: "#ff80bf",
			police_accent: "#ff00ff",
			police_roof: "#ff1493",
			police_roof_outline: "#ff0099",
			fire_accent: "#ff0066",
			fire_roof: "#ff3399",
			fire_roof_outline: "#ff0033",
			bench_options: ["#ffcce6", "#ffb3d9", "#ffccf2",
				"#ff99cc", "#ff80bf", "#ffe6f2", "#ff66b2"
			]
		},
		objects: {
			fuel_base: "#ffffff",
			fuel_92: "#ffccf2",
			fuel_98: "#ffebf5",
			fuel_80: "#ffb3d9",
			fuel_display: "#ff00ff",
			hotdog_body: "#ffe6f2",
			hotdog_stripe_red: "#ff1493",
			hotdog_stripe_white: "#ffffff",
			hotdog_window: "#ff00ff"
		}
	}
};