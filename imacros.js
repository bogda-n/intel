const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const pretty = require('pretty');
const jsonexport = require('jsonexport');
const url = 'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&forwardPath=/content/www/us/en/ark/search/featurefilter.html';
const parentDir = 'C:/Users/Rudik/Dropbox/iMacros/Macros/Processors Intel';

const start = async () => {
	try {
		const processors = [];
		const response = await axios.get(url);
		const dom = new JSDOM(pretty(response.data));
		const productTable = dom.window.document.getElementById('product-table');
		const products = productTable.querySelectorAll('tbody tr');
		products.forEach(product => {
			const features = [...product.querySelectorAll('td')].map(node => {
				return node.innerHTML
					.replace(/<a.+?>|<\/a>|<label.+label>/gm, '')
					.replace(/intel|processor|with.+|extreme.+|x-series.+|for.+/gmi, '')
					.replace(/\s+\s/gmi, ' ')
					.replace(/\n|([^\u0000-\u007F]+)/gm, '')
					.trim();
			});

			if (!/i5\+|i7\+|i\d-l|itanium|movidius|quark|xeon phi/i.test(features[0])) {
				const cache = features[6].replace(/mb.+|mb/gmi, '').trim();
				const cacheType = /smart/i.test(features[6]) ? 'Smart Cache' :
													/l2/i.test(features[6]) ? 'L2' :
													/l3/i.test(features[6]) ? 'L3' :
													/last/i.test(features[6]) ? 'Last Level Cache' : '';
				let family;
				switch (true) {
					case /atom/i.test(features[0]):
						family = 'Intel Atom';
						break;
					case /celeron/i.test(features[0]):
						family = /celeron g/gi.test(features[0]) ? 'Intel Celeron G' :
										 /celeron j/gi.test(features[0]) ? 'Intel Celeron J' :
										 /celeron n/gi.test(features[0]) ? 'Intel Celeron N' :
										 /celeron/gi.test(features[0]) ? 'Intel Celeron' : '';
						break;
					case /pentium/i.test(features[0]):
						family = /pentium gold/gi.test(features[0]) ? 'Intel Pentium Gold' :
										 /pentium silver/gi.test(features[0]) ? 'Intel Pentium Silver' :
										 /pentium d/gi.test(features[0]) ? 'Intel Pentium D' :
										 /pentium g/gi.test(features[0]) ? 'Intel Pentium G' :
										 /pentium j/gi.test(features[0]) ? 'Intel Pentium J' :
										 /pentium n/gi.test(features[0]) ? 'Intel Pentium N' :
										 /pentium/gi.test(features[0]) ? 'Intel Pentium' : '';
						break;
					case /xeon/i.test(features[0]):
						family = /xeon gold/gi.test(features[0]) ? 'Intel Xeon Gold' :
										 /xeon silver/gi.test(features[0]) ? 'Intel Xeon Silver' :
										 /xeon bronze/gi.test(features[0]) ? 'Intel Xeon Bronze' :
										 /xeon platinum/gi.test(features[0]) ? 'Intel Xeon Platinum' :
										 /xeon e\d/gi.test(features[0]) ? (() => {
												const family = features[0]
													.replace(/xeon/gi, ' ')
													.replace(/-.+v/gi, ' V')
													.trim();
												return `Intel Xeon ${family}`;
											})() :
										 /xeon e/gi.test(features[0]) ? 'Intel Xeon E' :
										 /xeon w/gi.test(features[0]) ? 'Intel Xeon W' :
										 /xeon/gi.test(features[0]) ? 'Intel Xeon' : '';
						break;
					case /core i/i.test(features[0]):
						family = 'Intel ' + features[0]
							.replace(/-11.*/g, '-11xxx')
							.replace(/-10.*/g, '-10xxx')
							.replace(/-9.*/g, '-9xxx')
							.replace(/-8.*/g, '-8xxx')
							.replace(/-7.*/g, '-7xxx')
							.replace(/-6.*/g, '-6xxx')
							.replace(/-5.*/g, '-5xxx')
							.replace(/-4.*/g, '-4xxx')
							.replace(/-3.*/g, '-3xxx')
							.replace(/-2.*/g, '-2xxx');
						break;
					case /core m/i.test(features[0]):
						family = 'Intel Core M';
						break;
				
					default:
						family = '-';
						break;
				}
				const dir = /atom/i.test(features[0]) ? 'Atom' :
										/celeron/i.test(features[0]) ? 'Celeron' :
										/core i3/i.test(features[0]) ? 'Core i3' :
										/core i5/i.test(features[0]) ? 'Core i5' :
										/core i7/i.test(features[0]) ? 'Core i7' :
										/core i9/i.test(features[0]) ? 'Core i9' :
										/core m/i.test(features[0]) ? 'Core M' :
										/pentium/i.test(features[0]) ? 'Pentium' :
										/xeon bronze/i.test(features[0]) ? 'Xeon Bronze' :
										/xeon gold/i.test(features[0]) ? 'Xeon Gold' :
										/xeon platinum/i.test(features[0]) ? 'Xeon Platinum' :
										/xeon silver/i.test(features[0]) ? 'Xeon Silver' :
										/xeon/i.test(features[0]) ? 'Xeon' : '';




				const turboFrequecy = /ghz/i.test(features[4]) ? features[4].replace(/ghz/i, '').trim() :
															/mhz/i.test(features[4]) ? features[4].replace(/mhz/i, '').trim() / 1000 : features[4];
				const baseFrequecy = /ghz/i.test(features[5]) ? features[5].replace(/ghz/i, '').trim() :
														 /mhz/i.test(features[5]) ? features[5].replace(/mhz/i, '').trim() / 1000 : features[5];
				const name = features[0]
					.replace(/atom|celeron|pentium|core|xeon|gold|silver|bronze|platinum/gi, '')
					.replace(/\sv\d/gi, a => {
						return a.replace(/\s+/g, '');
					})
					.trim();

				processors.push({
					name,
					family,
					dir,
					filename: name.replace(/i\d-/g, ''),
					cores: features[3],
					turboFrequecy: turboFrequecy ? +turboFrequecy : '-',
					baseFrequecy: baseFrequecy ? +baseFrequecy : '-',
					cache: cache ? +cache : '',
					cacheType: cacheType,
					isGraphics: features[8] ? 'Y' : '-',
					graphics: features[8]? `Intel ${features[8]}` : '-'
				});	
			}
		});

		for (const processor of processors) {
			const notebooks = `TAB T={{!LOOP}}
				\'Created by ruslan_m, ${new Date()}
				\'${processor.name.replace(/\s/g, '<SP>')}, ${processor.family.replace(/\s/g, '<SP>')}, ${processor.cores}, ${processor.baseFrequecy}, ${processor.turboFrequecy}, ${processor.cache}, ${processor.cacheType.replace(/\s/g, '<SP>')}, ${processor.isGraphics}, ${processor.graphics.replace(/\s/g, '<SP>')}
				\'Processor model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_49 CONTENT=%${processor.name.replace(/\s/g, '<SP>')}
				\'Processor family
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11560 CONTENT=%${processor.family.replace(/\s/g, '<SP>')}
				\'Processor cores
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_57809 CONTENT=%${processor.cores}
				\'Processor frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73715 CONTENT=${processor.baseFrequecy}
				\'Processor boost frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_56907 CONTENT=${processor.turboFrequecy}
				\'Processor cache
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_95853 CONTENT=${processor.cache}
				\'Processor cache type
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_135207 CONTENT=%${processor.cacheType.replace(/\s/g, '<SP>')}
				\'On-board graphics adapter
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_74327 CONTENT=%${processor.isGraphics}
				\'On-board graphics adapter model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_53952 CONTENT=%${processor.graphics.replace(/\s/g, '<SP>')}
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_2721 CONTENT=%Intel
			`;
			const notebooksPath = path.resolve(parentDir, 'Notebooks', processor.dir);
			await fs.ensureDir(notebooksPath);
			fs.writeFile(path.resolve(notebooksPath, processor.filename + '.iim'), notebooks.replace(/^\s+/gm, ''));
			
			const pcs = `TAB T={{!LOOP}}
				\'Created by ruslan_m, ${new Date()}
				\'${processor.name.replace(/\s/g, '<SP>')}, ${processor.family.replace(/\s/g, '<SP>')}, ${processor.cores}, ${processor.baseFrequecy}, ${processor.turboFrequecy}, ${processor.cache}, ${processor.cacheType.replace(/\s/g, '<SP>')}, ${processor.isGraphics}, ${processor.graphics.replace(/\s/g, '<SP>')}
				\'Processor model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62 CONTENT=%${processor.name.replace(/\s/g, '<SP>')}
				\'Processor family
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11561 CONTENT=%${processor.family.replace(/\s/g, '<SP>')}
				\'Processor cores
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_36486 CONTENT=%${processor.cores}
				\'Processor frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73716 CONTENT=${processor.baseFrequecy}
				\'Processor boost frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_52264 CONTENT=${processor.turboFrequecy}
				\'Processor cache
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_101563 CONTENT=${processor.cache}
				\'Processor cache type
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_135208 CONTENT=%${processor.cacheType.replace(/\s/g, '<SP>')}
				\'On-board graphics adapter
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_74328 CONTENT=%${processor.isGraphics}
				\'On-board graphics adapter model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_53944 CONTENT=%${processor.graphics.replace(/\s/g, '<SP>')}
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_3032 CONTENT=%Intel
			`;
			const pcsPath = path.resolve(parentDir, 'PCs', processor.dir);
			await fs.ensureDir(pcsPath);
			fs.writeFile(path.resolve(pcsPath, processor.filename + '.iim'), pcs.replace(/^\s+/gm, ''));

			const aios = `TAB T={{!LOOP}}
				\'Created by ruslan_m, ${new Date()}
				\'${processor.name.replace(/\s/g, '<SP>')}, ${processor.family.replace(/\s/g, '<SP>')}, ${processor.cores}, ${processor.baseFrequecy}, ${processor.turboFrequecy}, ${processor.cache}, ${processor.cacheType.replace(/\s/g, '<SP>')}, ${processor.isGraphics}, ${processor.graphics.replace(/\s/g, '<SP>')}
				\'Processor model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62592 CONTENT=%${processor.name.replace(/\s/g, '<SP>')}
				\'Processor family
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62591 CONTENT=%${processor.family.replace(/\s/g, '<SP>')}
				\'Processor cores
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62594 CONTENT=%${processor.cores}
				\'Processor frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73724 CONTENT=${processor.baseFrequecy}
				\'Processor boost frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_62593 CONTENT=${processor.turboFrequecy}
				\'Processor cache
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_62596 CONTENT=${processor.cache}
				\'Processor cache type
				\'TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_135209 CONTENT=%${processor.cacheType.replace(/\s/g, '<SP>')}
				\'On-board graphics adapter
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_74333 CONTENT=%${processor.isGraphics}
				\'On-board graphics adapter model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62736 CONTENT=%${processor.graphics.replace(/\s/g, '<SP>')}
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_63185 CONTENT=%Intel
			`;
			const aiosPath = path.resolve(parentDir, 'All-in One', processor.dir);
			await fs.ensureDir(aiosPath);
			fs.writeFile(path.resolve(aiosPath, processor.filename + '.iim'), aios.replace(/^\s+/gm, ''));

			const servers = `TAB T={{!LOOP}}
				\'Created by ruslan_m, ${new Date()}
				\'${processor.name.replace(/\s/g, '<SP>')}, ${processor.family.replace(/\s/g, '<SP>')}, ${processor.cores}, ${processor.baseFrequecy}, ${processor.turboFrequecy}, ${processor.cache}, ${processor.cacheType.replace(/\s/g, '<SP>')}, ${processor.isGraphics}, ${processor.graphics.replace(/\s/g, '<SP>')}
				\'Processor model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_1239 CONTENT=%${processor.name.replace(/\s/g, '<SP>')}
				\'Processor family
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11563 CONTENT=%${processor.family.replace(/\s/g, '<SP>')}
				\'Processor cores
				\'TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_31274 CONTENT=%${processor.cores}
				\'Processor frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73717 CONTENT=${processor.baseFrequecy}
				\'Processor boost frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_72626 CONTENT=${processor.turboFrequecy}
				\'Processor cache
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_135262 CONTENT=${processor.cache}
				\'Processor cache type
				\'TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_135210 CONTENT=%${processor.cacheType.replace(/\s/g, '<SP>')}
				\'On-board graphics adapter
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_64539 CONTENT=%${processor.isGraphics}
				\'On-board graphics adapter model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_134996 CONTENT=%${processor.graphics.replace(/\s/g, '<SP>')}
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_4443 CONTENT=%Intel
			`;
			const serversPath = path.resolve(parentDir, 'Servers', processor.dir);
			await fs.ensureDir(serversPath);
			fs.writeFile(path.resolve(serversPath, processor.filename + '.iim'), servers.replace(/^\s+/gm, ''));

			const tablets = `TAB T={{!LOOP}}
				\'Created by ruslan_m, ${new Date()}
				\'${processor.name.replace(/\s/g, '<SP>')}, ${processor.family.replace(/\s/g, '<SP>')}, ${processor.cores}, ${processor.baseFrequecy}, ${processor.turboFrequecy}, ${processor.cache}, ${processor.cacheType.replace(/\s/g, '<SP>')}, ${processor.isGraphics}, ${processor.graphics.replace(/\s/g, '<SP>')}
				\'Processor model
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_6931 CONTENT=%${processor.name.replace(/\s/g, '<SP>')}
				\'Processor family
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11580 CONTENT=%${processor.family.replace(/\s/g, '<SP>')}
				\'Processor cores
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_57773 CONTENT=%${processor.cores}
				\'Processor frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73721 CONTENT=${processor.baseFrequecy}
				\'Processor boost frequency
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_91856 CONTENT=${processor.turboFrequecy}
				\'Processor cache
				\'TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_63465 CONTENT=${processor.cache}
				\'Graphics adapter family
				TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_46082 CONTENT=${processor.isGraphics ? 'Intel' : ''}
				\'Graphics adapter
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_16583 CONTENT=%${processor.graphics.replace(/intel/gi, '').trim().replace(/\s/g, '<SP>')}
				TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_102551 CONTENT=%Intel
			`;
			const tabletsPath = path.resolve(parentDir, 'Tablets', processor.dir);
			await fs.ensureDir(tabletsPath);
			fs.writeFile(path.resolve(tabletsPath, processor.filename + '.iim'), tablets.replace(/^\s+/gm, ''));
		}



		// const csv = await jsonexport(processors, {rowDelimiter: '|'});
		// fs.writeFileSync('test.csv', csv);
		// console.log(processors);
	} catch (error) {
		console.error(error);
	}
};

start();