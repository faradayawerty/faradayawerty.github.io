let Config = {
	defaultPictureSets: {
		countryFlags: [
			"europe_croatia.jpg",
			"europe_czech.jpg",
			"europe_denmark.jpg",
			"europe_estonia.jpg",
			"europe_finland.jpg",
			"europe_france.jpg",
			"europe_germany.jpg",
			"europe_greece.jpg",
			"europe_hungary.jpg",
			"europe_ireland.jpg",
			"europe_italy.jpg",
			"europe_lithuania.jpg",
			"europe_moldova.jpg",
			"europe_netherlands.jpg",
			"europe_norway.jpg",
			"europe_poland.jpg",
			"europe_portugal.jpg",
			"europe_russia.jpg",
			"europe_slovakia.jpg",
			"europe_slovenia.jpg",
			"europe_spain.jpg",
			"europe_sweden.jpg",
			"europe_switzerland.jpg",
			"europe_uk.jpg",
			"europe_ukraine.jpg",
			"europe_vatican.jpg",
			"europe_wales.jpg",
			"oceania_australia.jpg",
			"oceania_fiji.jpg",
			"oceania_new_zealand.jpg",
			"oceania_samoa.jpg",
			"africa_egypt.jpg",
			"africa_ethiopia.jpg",
			"africa_ghana.jpg",
			"africa_kenya.jpg",
			"africa_morocco.jpg",
			"africa_nigeria.jpg",
			"africa_south_africa.jpg",
			"africa_tunisia.jpg",
			"america_argentina.jpg",
			"america_brazil.jpg",
			"america_canada.jpg",
			"america_chile.jpg",
			"america_colombia.jpg",
			"america_cuba.jpg",
			"america_guatemala.jpg",
			"america_mexico.jpg",
			"america_peru.jpg",
			"america_usa.jpg",
			"america_venezuela.jpg",
			"asia_iran.jpg",
			"asia_israel.jpg",
			"asia_japan.jpg",
			"asia_kuwait.jpg",
			"asia_malaysia.jpg",
			"asia_maldives.jpg",
			"asia_nepal.jpg",
			"asia_north_korea.jpg",
			"asia_bahrain.jpg",
			"asia_bangladesh.jpg",
			"asia_china.jpg",
			"asia_india.jpg",
			"asia_indonesia.jpg",
			"asia_oman.jpg",
			"asia_pakistan.jpg",
			"asia_philippines.jpg",
			"asia_qatar.jpg",
			"asia_saudi_arabia.jpg",
			"asia_singapore.jpg",
			"asia_south_korea.jpg",
			"asia_sri_lanka.jpg",
			"asia_tajikistan.jpg",
			"asia_thailand.jpg",
			"asia_uae.jpg",
			"asia_uzbekistan.jpg",
			"asia_vietnam.jpg",
		],
		everlastingSummerCharacters: [
			"alisa.webp",
			"electronic.webp",
			"jenya.webp",
			"lena.webp",
			"miku.webp",
			"olga_dmitrievna.webp",
			"pioneer.webp",
			"semen.webp",
			"shurik.webp",
			"slavya.webp",
			"ulyana.webp",
			"viola.webp",
			"yulya.webp",
		],
		zoomers: [
			"photo_2025-10-28_22-07-52.jpg",
			"photo_2025-10-28_22-07-58.jpg",
			"photo_2025-10-28_22-08-01.jpg",
			"photo_2025-10-28_22-08-03.jpg",
			"photo_2025-10-28_22-08-05.jpg",
			"photo_2025-10-28_22-08-08.jpg",
			"photo_2025-10-28_22-08-10.jpg",
			"photo_2025-10-28_22-08-15.jpg",
			"photo_2025-10-28_22-08-17.jpg",
			"photo_2025-10-28_22-08-23.jpg",
			"photo_2025-10-28_22-08-45.jpg",
			"photo_2025-10-28_22-08-48.jpg",
			"photo_2025-10-28_22-08-51.jpg",
			"photo_2025-10-28_22-08-53.jpg",
			"photo_2025-10-28_22-08-55.jpg",
			"photo_2025-10-28_22-08-59.jpg",
			"photo_2025-10-28_22-09-02.jpg",
			"photo_2025-10-28_22-09-15.jpg",
		]
	},
	iceServers: [

		// google
		{
			urls: "stun:stun.l.google.com:19302"
		}, {
			urls: "stun:stun1.l.google.com:19302"
		}, {
			urls: "stun:stun2.l.google.com:19302"
		}, {
			urls: "stun:stun3.l.google.com:19302"
		}, {
			urls: "stun:stun4.l.google.com:19302"
		},

		// tested, working without vpn in moscow
		{
			urls: 'stun:stun.fitauto.ru:3478'
		}, {
			urls: 'stun:stun.ru-brides.com:3478'
		}, {
			urls: 'stun:stun.siptrunk.com:3478'
		}, {
			urls: 'stun:stun.nextcloud.com:3478'
		}, {
			urls: 'stun:stun.12connect.com:3478'
		}, {
			urls: 'stun:stun.12voip.com:3478'
		}, {
			urls: 'stun:stun.1und1.de:3478'
		}, {
			urls: 'stun:stun.3deluxe.de:3478'
		}, {
			urls: 'stun:stun.3wayint.com:3478'
		}, {
			urls: 'stun:stun.aa.net.uk:3478'
		}, {
			urls: 'stun:stun.acrobits.cz:3478'
		}, {
			urls: 'stun:stun.acronis.com:3478'
		}, {
			urls: 'stun:stun.actionvoip.com:3478'
		}, {
			urls: 'stun:stun.annatel.net:3478'
		}, {
			urls: 'stun:stun.antisip.com:3478'
		}, {
			urls: 'stun:stun.atagverwarming.nl:3478'
		}, {
			urls: 'stun:stun.axialys.net:3478'
		}, {
			urls: 'stun:stun.baltmannsweiler.de:3478'
		}, {
			urls: 'stun:stun.bethesda.net:3478'
		}, {
			urls: 'stun:stun.bitburger.de:3478'
		}, {
			urls: 'stun:stun.dus.net:3478'
		}, {
			urls: 'stun:stun.moonlight-stream.org:3478'
		},

		// tested, working with vpn
		{
			urls: 'stun:stun.1und1.de:3478'
		}, {
			urls: 'stun:stun.3deluxe.de:3478'
		}, {
			urls: 'stun:stun.callromania.ro:3478'
		}, {
			urls: 'stun:stun.comfi.com:3478'
		}, {
			urls: 'stun:stun.cope.es:3478'
		}, {
			urls: 'stun:stun.bridesbay.com:3478'
		}, {
			urls: 'stun:stun.business-isp.nl:3478'
		}, {
			urls: 'stun:stun.diallog.com:3478'
		},
	],

	colors: {
		page: {
			background: "#2e3440",
		},
		pictureContainer: {
			background: "#3b4252",
			pictureContainerBackground: "#434c5e",
			buttonContainerBackground: "#4c566a",
			buttonColor: "#88c0d0",
			buttonColorHover: "#8fbcbb",
			pictureWrapper: "#5e81ac",
			noColor: '#bf616a',
			deleteButton: '#bf616aaa',

			pictureSetSelector: {
				overlayBackground: "rgba(46, 52, 64, 0.9)",
				modalBackground: "#3b4252",
				titleColor: "#88c0d0",
				buttonBackground: "#4c566a",
				buttonHover: "#81a1c1",
				buttonText: "#eceff4",
				cancelButtonBackground: "#bf616a",
				cancelButtonHover: "#d08770"
			}
		},
		chatContainer: {
			textColor: "#eceff4",
			textColorDark: "#2e3440",
			background: "#3b4252",
			infoBox: "#4c566a",
			history: "#434c5e",
			input: "#4c566a",
		},
	}

}
