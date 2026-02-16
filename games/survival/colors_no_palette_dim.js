let COLORS_SCHEME_DEFAULT_NO_PALETTE_DIM = {
	trashcan: {
		fill: "#555555",
		stroke: "#333333"
	},
	rocket: {
		health_bg: "#772222",
		health_fill: "#4ade80",
		wings: "#b22222",
		color: "#888888"
	},
	cars: {
		types: {
			default: {
				body: "#555",
				outline: "#000"
			},
			police: {
				body: "#222222",
				stripe: "#1e40af",
				line: "#e2e8f0",
				siren_alt: "#2563eb"
			},
			fireman: {
				body: "#991b1b",
				ladder: "#cbd5e1",
				siren_alt: "#f59e0b"
			},
			ambulance: {
				body: "#f8fafc",
				stripe: "#b91c1c",
				siren_alt: "#f59e0b"
			},
			taxi: {
				body: "#eab308",
				checkers: "#000000",
				sign_bg: "#000000",
				sign_text: "#facc15"
			}
		},
		common: {
			outline: "#000000",
			shadow: "rgba(0, 0, 0, 0.3)",
			glass: "#94a3b8",
			glass_outline: "#1e293b",
			glass_reflection: "rgba(255, 255, 255, 0.2)",
			wheels: "#111111",
			siren_red: "#ef4444"
		},
		tank: {
			tracks: "#1a1a1a",
			track_lines: "#333333",
			barrel: "#222222",
			muzzle: "black"
		},
		ui: {
			health_bg: "#7f1d1d",
			health_fill: "#22c55e",
			fuel_bg: "#451a03",
			fuel_fill: "#94a3b8"
		}
	},
	bullets: {
		default_fill: "#fde047",
		default_outline: "#ca8a04",
	},
	player: {
		red: "#dc2626",
		blue: "#2563eb",
		yellow: "#eab308",
		lime: "#65a30d",
		hair_default: "#442200",
		skin: "#d2b48c",
		eye_white: "#f8fafc",
		eye_iris: "#000000",
		shoes: "#111",
		arm_sleeve: "#222",
		arm_hand: "#111",
		outline: "black",
		laser_glow: "#ffffff",
		shield_blue_fill: "#1d4ed8",
		shield_blue_stroke: "#1e3a8a",
		indicator_bg: "#7f1d1d",
		indicator_health: "#22c55e",
		indicator_thirst: "#0ea5e9",
		indicator_hunger: "#d97706",
		indicator_shield_bg: "#475569"
	},
	enemies: {
		regular: {
			body: "#166534",
			outline: "#f1f5f9",
			eye: "#991b1b"
		},
		shooting: {
			body: "#335544",
			outline: "#f1f5f9",
			eye: "#991b1b",
			gun: "#331133",
			bullet_fill: "#3b82f6",
			bullet_outline: "#f1f5f9"
		},
		desert: {
			body: "#c2a26b",
			outline: "#4d3d21",
			eye: "#991b1b",
			gun: "#222222",
			bullet_fill: "#aa4400",
			bullet_outline: "#eab308"
		},
		shooting_red: {
			body: "#999999",
			outline: "#991b1b",
			eye: "#fde047",
			gun: "#551111",
			bullet_main: "#ef4444",
			bullet_alt: "#fda4af"
		},
		sword: {
			body: "#a16207",
			outline: "#65a30d",
			eye: "#991b1b",
			sword: "#4d7c0f",
			bullet_fill: "#64748b",
			bullet_outline: "#65a30d"
		},
		mummy: {
			body: "#e2d1b3",
			outline: "#8b7355",
			eye: "#0ea5e9",
			gun: "#5588aa",
			bandage_shadow: "rgba(139, 115, 85, 0.5)",
			glow: "#0ea5e9"
		},
		rocket: {
			body: "#64748b",
			outline: "#000000",
			eye: "#eab308",
			gun: "#1e3a8a"
		},
		shadow: {
			body: "rgba(10, 10, 10, 0.8)",
			body_icon: "#222222",
			outline: "#cbd5e1",
			eye: "#7e22ce",
			bullet_fill: "#6366f1",
			bullet_outline: "#000000"
		},
		anubis: {
			body: "#0a0a0a",
			outline: "#d4af37",
			eye: "#fde047",
			gun: "#d4af37",
			cloth_alt: "#1e40af",
			bullet_fill: "#dc2626",
			bullet_outline: "#f59e0b",
			stream_fill: "#f97316",
			stream_outline: "#000000"
		},
		laser: {
			body_fallback: "#000000",
			outline: "#ffffff",
			eye: "#ffffff",
			gun: "#331133",
			rainbow: ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6"]
		},
		deer_boss: {
			body: "#4a2c16",
			outline: "#f2d291",
			eye: "#991b1b"
		},
		raccoon_boss: {
			body: "#444444",
			outline: "#991b1b",
			eye: "#ef4444",
			trash_bullet: "#666666"
		},
		scorpion_boss: {
			body: "#0a0a0a",
			eye: "#ef4444",
			venom_bullet: "#22c55e"
		},
		snake_boss: {
			body: "#1a1a1a",
			outline: "#16a34a",
			eye: "#991b1b",
			venom_stream: "#65a30d",
			venom_outline: "#000000"
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
				body: "#111111",
				eye: "#991b1b"
			},
			scorpion: {
				dark: "#0a0a0a",
				mid: "#222222",
				light: "#3d3d3d",
				eye: "#dc2626",
				eye_shadow: "#7f1d1d"
			},
			bosses: {
				raccoon: {
					ears: "#333333",
					body: "#555555",
					mask: "#111111",
					eye: "#dc2626",
					eye_shadow: "#7f1d1d",
					mouth: "#f1f5f9",
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
			health_bg: "#7f1d1d",
			health_fill: "#22c55e",
			hunger_bg: "#78350f",
			hunger_fill: "#d97706"
		}
	},
	items: {
		cactus_juice: {
			liquid: "#86efac",
			bottle: "#fef08a",
			label: "#166534",
			spike: "#064e3b"
		},
		money: {
			fill: "#4ade80",
			stroke: "#166534",
			icon: "#166534"
		},
		apple_core: {
			body: "#eeeecc",
			bit: "#dc2626",
			stick: "#442200"
		},
		fish_bone: {
			color: "#cbd5e1"
		},
		bottle: {
			body: "rgba(148, 163, 184, 0.4)",
			stroke: "#f1f5f9"
		},
		can: {
			body: "#94a3b8",
			stripe: "#64748b",
			inside: "#334155",
			reflection: "#cbd5e1",
			lid: "#475569"
		},
		shoe: {
			body: "#553311"
		},
		fork: {
			color: "#94a3b8"
		},
		crumpled_paper: {
			body: "#ffffff",
			stroke: "#cbd5e1",
			line: "#e2e8f0"
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
			accent: "#c026d3"
		},
		venom_vial: {
			cork: "#5d2e0c",
			glass: "rgba(200, 200, 200, 0.3)",
			glass_outline: "#eee",
			liquid_base: [22, 101, 52],
			liquid_pulse: 20,
			skull: "#fff",
			eyes: "#000",
			reflection: "rgba(255, 255, 255, 0.2)"
		},
		ammo_standard: {
			main: "#facc15",
			tip: "#d97706",
			outline: "#b45309"
		},
		ammo_plasma: {
			main: "#22d3ee",
			tip: "#2563eb",
			outline: "#f8fafc"
		},
		ammo_red_plasma: {
			main: "#fb7185",
			tip: "#e11d48",
			outline: "#9f1239"
		},
		ammo_corrosive: {
			main: "#84cc16",
			tip: "#166534",
			outline: "#064e3b"
		},
		ammo_rocket: {
			main: "#475569",
			tip: "#991b1b",
			outline: "#111111"
		},
		ammo_rainbow: {
			mains: ["#fda4af", "#fef08a", "#bef264", "#a5f3fc"],
			tips: ["#e11d48", "#f59e0b", "#4d7c0f", "#0284c7"],
			outline: "#f8fafc"
		},
		health_kit: {
			bg: "#f8fafc",
			icon: "#2563eb",
			stroke: "#1e40af"
		},
		health_kit_adv: {
			bg: "#f8fafc",
			icon: "#16a34a",
			stroke: "#166534"
		},
		fuel: {
			body: "#991b1b",
			shadow: "#7f1d1d",
			accent: "#b91c1c",
			cap: "#eab308",
			outline: "#000000"
		},
		canned_meat: {
			body: "#64748b",
			label: "#7f1d1d"
		},
		water: {
			bottle: "#64748b",
			liquid: "#2563eb"
		},
		cola: {
			bottle: "#64748b",
			liquid: "#991b1b"
		},
		milk: {
			top: "#1e3a8a",
			bottom: "#f1f5f9",
			outline: "#000000"
		},
		chocolate: {
			dark: "#331100",
			wrapper: "#991b1b",
			border: "#220800",
			gold: "#d4af37"
		},
		orange: {
			skin: "#f97316",
			shadow: "#7c2d12",
			light: "#fb923c",
			stem: "#442200"
		},
		apple: {
			skin: "#dc2626",
			shadow: "#450a0a",
			stem: "#442200",
			leaf: "#166534",
			light: "rgba(255, 255, 255, 0.4)"
		},
		cherries: {
			stem: "#166534",
			fruit1: "#991b1b",
			fruit2: "#b91c1c",
			shadow: "#450a0a",
			light: "#f1f5f9"
		},
		chicken: {
			bone: "#f1f5f9",
			bone_shadow: "#cbd5e1",
			meat_dark: "#884411",
			meat_light: "#aa6622"
		},
		shield_energy: {
			fill: "#0ea5e9",
			outline: "#f1f5f9"
		},
		shield_kinetic: {
			fill: "#22c55e",
			outline: "#f1f5f9"
		},
		shield_shadow: {
			fill: "#1e1b4b",
			outline: "#7e22ce"
		},
		aegis: {
			body: "#991b1b",
			gold: "#d4af37"
		},
		bossifier: {
			bg: "black"
		}
	},
	weapons: {
		common: {
			metal: "#334155",
			metal_light: "#64748b",
			metal_dark: "#1e293b",
			silver: "#94a3b8",
			silver_light: "#cbd5e1",
			silver_dark: "#475569",
			silver_bright: "#e2e8f0",
			wood: "#78350f",
			wood_dark: "#451a03",
			wood_alt: "#7c2d12",
			black: "#000000",
			black_soft: "#1e293b",
			gray: "#64748b",
			gray_dark: "#334155",
			white_transp: "rgba(255,255,255,0.1)",
			white_gloss: "rgba(255, 255, 255, 0.2)"
		},
		venom: {
			liquid_base: [22, 101, 52],
			liquid_pulse: 40,
			liquid_smg_base: [21, 128, 61],
			liquid_smg_pulse: 50,
			vial_bg: "rgba(34, 197, 94, 0.15)",
			tentacle: "#16a34a",
			dark: "#052e16",
			acid: "#4ade80",
			mid: "#15803d"
		},
		energy: {
			plasma: "#06b6d4",
			plasma_dark: "#1e1b4b",
			plasma_vdark: "#0f172a",
			soul_bg: "#d2b48c",
			soul_outline: "#8b7355",
			soul_glow: "#22d3ee",
			void_body: "#1e1b4b",
			void_glow: "rgba(126, 34, 206, 0.5)",
			void_core: "#4f46e5",
			void_accent: "#c026d3",
			void_vdark: "#020617",
			void_purple: "#3b0764",
			laser_main: "#7e22ce",
			laser_accent: "#c026d3",
			laser_line: "#f1f5f9",
		},
		special: {
			mummy_pistol: "#d2b48c",
			mummy_bullet: "#0ea5e9",
			mummy_bullet_outline: "#f8fafc",
			shadow_staff: "#1e1b4b",
			shadow_bullet: "#4f46e5",
			shadow_dual: "#0f172a",
			shadow_dual_bullet: "#9333ea",
			anubis_punisher: "#d4af37",
			anubis_bullet_red: "#991b1b",
			anubis_bullet_gold: "#eab308",
			snake_staff: "#1a0f05",
			snake_bullet: "#22c55e",
			snake_bullet_alt: "#84cc16",
			venom_dual: "#14532d",
			venom_shotgun: "#064e3b",
			acid_smg: "#166534",
			acid_bullet: "#22c55e",
			acid_bullet_dark: "#15803d",
			stone_bullet: "#64748b",
			stone_bullet_outline: "#1e293b",
			kalashnikov: "#334155",
			kalash_bullet: "#facc15",
			green_gun: "#166534",
			rainbow_white: "#f8fafc",
			red_main: "#b91c1c",
			red_glow: "#ef4444",
			rocket_body: "#1e1b4b",
			rocket_eye: "#ef4444",
			rocket_alt: "#f97316",
			minigun_blue: "#1e40af",
			minigun_blue_light: "#3b82f6",
			minigun_blue_dark: "#1e3a8a",
			junk_body: "#475569",
			junk_alt: "#64748b",
			junk_stroke: "#2563eb",
			stone_stroke: "#475569",
			stick_main: "#78350f",
			stick_stroke: "#451a03",
			sword_blade: "#16a34a",
			sword_stroke: "#a16207",
			sword_handle: "#443311",
			sword_guard: "#332211",
			sword_lines: "rgba(0,0,0,0.2)",
			anubis_gold: "#d4af37",
			anubis_orange: "#d97706",
			anubis_orange_transp: "rgba(217, 119, 6, 0.5)"
		}
	},
	ui: {
		hotbar: {
			cell_bg: "rgba(30, 58, 138, 0.8)",
			cell_selected: "#0ea5e9",
			button_bg: "#1e40af",
			button_hover: "#2563eb",
			button_outline: "#f1f5f9",
			indicator_outline: "rgba(255,255,255,0.2)",
			tooltip_bg: "rgba(0,0,0,0.9)",
			tooltip_border: "#475569",
			tooltip_title: "#facc15",
			tooltip_text: "#f1f5f9",
			resources: {
				hunger_empty: "#451a03",
				hunger_full: "#ea580c",
				thirst_empty: "#172554",
				thirst_full: "#2563eb",
				health_empty: "#450a0a",
				health_full: "#16a34a",
				shield_empty: "#1e293b",
				shield_default: "#06b6d4"
			},
			icons: {
				inv_bag: "#78350f",
				inv_flap: "#451a03",
				inv_buckle: "#eab308",
				ach_cup: "#d4af37",
				ach_outline: "#b45309"
			}
		},
		inventory: {
			cell_bg: "rgba(30, 58, 138, 0.8)",
			cell_selected: "#0ea5e9",
			cell_move: "#d97706",
			cell_hotbar_outline: "#22d3ee",
			close_bg: "#334155",
			close_hover: "#991b1b",
			close_icon: "#f1f5f9",
			close_icon_hover: "#fecaca",
			btn_use: "#15803d",
			btn_drop: "#991b1b",
			btn_text: "#f8fafc",
			btn_outline: "#f8fafc",
			popup_bg: "black",
			popup_border: "#475569",
			popup_title: "#facc15",
			popup_text: "#f1f5f9"
		},
		achievements: {
			bg: "#020617",
			border: "#475569",
			cross_bg: "#334155",
			cross_hover: "#991b1b",
			cross_icon_hover: "#fecaca",
			text_main: "#f8fafc",
			text_accent: "#facc15",
			text_dim: "rgba(241, 245, 249, 0.6)",
			popup_bg: "#020617",
			popup_border: "#475569",
			question_mark: "#475569",
			palette: {
				cyan: "#06b6d4",
				purple: "#9333ea",
				orange: "#f97316",
				blue_light: "#3b82f6",
				blue_bright: "#2563eb",
				green_dark: "#14532d",
				red_bright: "#dc2626",
				gold: "#d4af37",
				tan: "#c2a26b",
				brown_dark: "#451a03",
				brown_mid: "#78350f",
				brown_light: "#a16207",
				red_orange: "#ea580c",
				gray_dark: "#1e293b",
				gray_mid: "#475569",
				gray_light: "#94a3b8",
				gray_very_dark: "#0f172a",
				gray_silver: "#cbd5e1",
				gray_text: "#64748b",
				black_soft: "#1e293b"
			}
		}
	},
	decorations: {
		nature: {
			grass: "#166534",
			sand: "#c2a26b",
			tree_leaves: "#15803d",
			tree_leaves_outline: "#052e16",
			tree_trunk: "#78350f",
			tree_trunk_outline: "#451a03",
			cactus_body: "#166534",
			cactus_outline: "#052e16",
			cactus_branch: "#15803d",
			cactus_flower: "#db2777",
			fountain_base: "#64748b",
			fountain_water: "#2563eb"
		},
		city: {
			road: "#1e293b",
			road_marking: "#cbd5e1",
			wall_default: "#334155",
			wall_outline: "#1e293b",
			building_fill: "#475569",
			hospital_accent: "#2563eb",
			hospital_walls: "#f8fafc",
			hospital_roof: "#f1f5f9",
			hospital_roof_outline: "#cbd5e1",
			police_accent: "#1e3a8a",
			police_roof: "#172554",
			police_roof_outline: "#020617",
			fire_accent: "#991b1b",
			fire_roof: "#7f1d1d",
			fire_roof_outline: "#450a0a",
			bench_options: ["#8b4513", "#a0522d", "#bc8f8f",
				"#b22222", "#cd853f", "#d2691e", "#800000"
			]
		},
		objects: {
			fuel_base: "#cbd5e1",
			fuel_92: "#eab308",
			fuel_98: "#16a34a",
			fuel_80: "#2563eb",
			fuel_display: "#0f172a",
			hotdog_body: "#facc15",
			hotdog_stripe_red: "#dc2626",
			hotdog_stripe_white: "#f8fafc",
			hotdog_window: "#991b1b"
		}
	}
};
