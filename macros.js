import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs-extra'
import path from 'path'
import PQueue from 'p-queue'

import * as templates from './modules/templates.js'



const myUrls = [
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=29862&forwardPath=/content/www/us/en/ark/search/featurefilter.html', 
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=122139&forwardPath=/content/www/us/en/ark/search/featurefilter.html',
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=29035&forwardPath=/content/www/us/en/ark/search/featurefilter.html',
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=43521&forwardPath=/content/www/us/en/ark/search/featurefilter.html',
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=451&forwardPath=/content/www/us/en/ark/search/featurefilter.html',
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=75557&forwardPath=/content/www/us/en/ark/search/featurefilter.html',
  'https://ark.intel.com/libs/apps/intel/support/ark/advancedFilterSearch?productType=873&1_Filter-Family=595&forwardPath=/content/www/us/en/ark/search/featurefilter.html'
]

const tempDir = '/home/bogda/Dropbox/dev/Intel/'

const processUrl = async (link) => {

  const res = await axios.get(`https://ark.intel.com/${link}`)


  const proc = {}
  const $ = cheerio.load(res.data.replace(/[^\u0000-\u007F]+|smart|for|Generation|processors/gmi, ''))

  proc.manufacturer = 'Intel'
  proc.name = $('[class="h1"]').text().trim()
  proc.family = ''
  proc.model = $('[data-key="ProcessorNumber"]').text().trim()
  proc.cores = $('[data-key="CoreCount"]').text().trim()
  proc.threads = $('[data-key="ThreadCount"]').text().trim()
  proc.freq = $('[data-key="ClockSpeed"]').text().trim()
  if (!proc.freq){
    proc.freq = '-'
  }
  proc.boost = $('[data-key="ClockSpeedMax"]').text().trim()
  proc.cache = $('[data-key="Cache"]').text().trim()

  proc.graphics = '-'
  proc.graphicsModel = '-'

  if (/fsb|quark|movidius/gmi.test(proc.name)) {
    return
  }


  if ($('[data-key="ProcessorGraphicsModelId"]').text().trim()) {
    proc.graphicsModel = $('[data-key="ProcessorGraphicsModelId"]').text()
      .replace(/\d+th.+/gmi, '')
      .replace('eligible', '')
      .trim()

    proc.graphics = 'Y'
  }

  if (proc.name.includes('Processor')) {
    proc.name = proc.name.replace('Processor', '').trim().replace(/\s\s/, ' ')

  }

  if (proc.name.includes('Xeon')) {
    if (proc.name.includes('Xeon Platinum')) {
      proc.family = 'Intel Xeon Platinum'

    }

    else if (proc.name.includes('Xeon Silver')) {
      proc.family = 'Intel Xeon Silver'
    }

    else if (proc.name.includes('Xeon Bronze')) {
      proc.family = 'Intel Xeon Bronze'
    }

    else if (proc.name.includes('Xeon Gold')) {
      proc.family = 'Intel Xeon Gold'
    }

    else if (proc.name.includes('Xeon Phi')) {
      proc.family = 'Intel Xeon Phi'
    }

    else if (proc.name.includes('Xeon D')) {
      proc.family = 'Intel Xeon D'
    }

    else if (proc.name.includes('Xeon W')) {
      proc.family = 'Intel Xeon'
    }

    else if (proc.name.includes('Xeon E-')) {
      proc.family = 'Intel Xeon E'
    }

    else if (/xeon e\d/gi.test(proc.name)) {
      proc.family = proc.name.replace(/-.+v/gi, ' v')
    }

    else {
      proc.family = proc.name
    }
  }

  if (proc.name.includes('Itanium')) {
    proc.family = 'Intel Itanium'
  }

  if (proc.name.includes('Atom')) {
    proc.family = 'Intel Atom'
  }

  if (proc.name.includes('Pentium')) {
    if (proc.name.includes('Gold')) {
      proc.family = 'Intel Pentium Gold'
    }
    else if (proc.name.includes('Silver')) {
      proc.family = 'Intel Pentium Silver'
    }

    else if (proc.name.includes('Bronze')) {
      proc.family = 'Intel Pentium Bronze'
    }

    else if (proc.name.includes('Platinum')) {
      proc.family = 'Intel Pentium Platinum'
    }

    else if (proc.name.includes('Pentium D')) {
      proc.family = 'Intel Pentium D'
    }

    else if (proc.name.includes('Pentium G')) {
      proc.family = 'Intel Pentium G'
    }

    else if (proc.name.includes('Pentium J')) {
      proc.family = 'Intel Pentium J'
    }

    else if (proc.name.includes('Pentium M')) {
      proc.family = 'Intel Pentium M'
    }

    else if (proc.name.includes('Pentium N')) {
      proc.family = 'Intel Pentium N'
    }

    else {
      proc.family = 'Intel Pentium'
    }

  }

  if (proc.name.includes('Celeron')) {

    if (proc.name.includes('Celeron D')) {
      proc.family = 'Intel Celeron D'
    }

    else if (proc.name.includes('Celeron G')) {
      proc.family = 'Intel Celeron G'
    }

    else if (proc.name.includes('Celeron J')) {
      proc.family = 'Intel Celeron J'
    }

    else if (proc.name.includes('Celeron M')) {
      proc.family = 'Intel Celeron M'
    }

    else if (proc.name.includes('Celeron N')) {
      proc.family = 'Intel Celeron N'
    }

    else {
      proc.family = 'Intel Celeron'
    }
  }

  if (proc.name.includes('Core i')) {

    if (/\w\d-[0-1][0-2]/gi.test(proc.name)) {
      proc.family = 'Intel Core ' + /\w\d-[0-1][0-2]/.exec(proc.name) + 'xxx'
    }

    else if (/\w\d-[3-9]/gi.test(proc.name)) {
      proc.family = 'Intel Core ' + /\w\d-[3-9]/.exec(proc.name) + 'xxx'
    }

    else if (/\w\d-\w\S+/gi.test(proc.name)) {
      proc.family = 'Intel Core ' + /\w\d-\w\S+/.exec(proc.name) + 'xxx'
    }
    if ($('[data-key="ProductGroup"]').text().trim().includes('X-')) {
      proc.family = 'Intel Core ' + /\w\d/.exec(proc.name) + ' X-series'
    }
  }

  if (/core m/gi.test(proc.name)) {
    if (/core m-/gi.test(proc.name)) {
      proc.family = 'Intel Core M'
      }

    else if (/core m\d-\S+/gi.test(proc.name)) {
      proc.family = 'Intel Core ' + /m\d-\S/.exec(proc.name) + 'xxx'
      }
    }


  if (proc.freq.includes('GHz')) {
    proc.freq = proc.freq.replace('GHz', '').trim() * 1
  }

  else if (proc.freq.includes('MHz')) {
    proc.freq = proc.freq.replace('MHz', '').trim() / 1000 * 1
  }

  if (proc.boost.includes('GHz')) {
    proc.boost = proc.boost.replace('GHz', '').trim() * 1
  }

  else if (proc.boost.includes('MHz')) {
    proc.boost = proc.boost.replace('MHz', '').trim() / 1000 * 1
  }

  if (proc.cache.includes('MB')) {
    proc.cache = /\d\S*/.exec(proc.cache)
  }

  else if (proc.cache.includes('KB')) {
    proc.cache = /\d\S*/.exec(proc.cache) / 1024 * 1
  }

  let fileName = proc.model + '.iim'
  if (/i\d-/gi.test(proc.model)) {
    fileName = fileName.replace(/i\d-/gi, '')
  }


  proc.family = proc.family.replace(/\s/gmi, '<SP>')
  proc.model = proc.model.replace(/\s/gmi, '<SP>')
  proc.graphicsModel = proc.graphicsModel.replace(/\s/gmi, '<SP>')

  const dir = /atom/i.test(proc.name) ? 'Atom' :
            /celeron/i.test(proc.name) ? 'Celeron' :
            /core i3/i.test(proc.name) ? 'Core i3' :
            /core i5/i.test(proc.name) ? 'Core i5' :
            /core i7/i.test(proc.name) ? 'Core i7' :
            /core i9/i.test(proc.name) ? 'Core i9' :
            /core m/i.test(proc.name) ? 'Core M' :
            /pentium/i.test(proc.name) ? 'Pentium' :
            /xeon bronze/i.test(proc.name) ? 'Xeon Bronze' :
            /xeon gold/i.test(proc.name) ? 'Xeon Gold' :
            /xeon platinum/i.test(proc.name) ? 'Xeon Platinum' :
            /xeon silver/i.test(proc.name) ? 'Xeon Silver' :
            /xeon/i.test(proc.name) ? 'Xeon' :
            /itanium/i.test(proc.name) ? 'Itanium' : ''

  const notebooksPath = path.resolve(tempDir, 'Notebooks', dir)
  await fs.ensureDir(notebooksPath)
  fs.writeFile(path.resolve(notebooksPath, fileName), templates.notebooks(proc))

  const pcsPath = path.resolve(tempDir, 'PCs', dir)
  await fs.ensureDir(pcsPath)
  fs.writeFile(path.resolve(pcsPath, fileName), templates.pcs(proc))

  const aiosPath = path.resolve(tempDir, 'AIOs', dir)
  await fs.ensureDir(aiosPath)
  fs.writeFile(path.resolve(aiosPath, fileName), templates.aios(proc))

  const serversPath = path.resolve(tempDir, 'Servers', dir)
  await fs.ensureDir(serversPath)
  fs.writeFile(path.resolve(serversPath, fileName), templates.servers(proc))

  const tabletsPath = path.resolve(tempDir, 'Tablets', dir)
  await fs.ensureDir(tabletsPath)
  fs.writeFile(path.resolve(tabletsPath, fileName), templates.tablets(proc))

  console.log(fileName, '- Has been processed')
}

const start = async () => {
  try {
    for (let myUrl of myUrls) {
      const response = await axios.get(myUrl)
      const $ = cheerio.load(response.data)

      const queue = new PQueue({concurrency: 30})

      // queue.on('add', () => {
      //   console.log(`Task is added.  Size: ${queue.size}  Pending: ${queue.pending}`)
      // })
      
      // queue.on('next', () => {
      //   console.log(`Task is completed.  Size: ${queue.size}  Pending: ${queue.pending}`)
      // })

      // queue.on('idle', () => {
      //   console.log('queue is clean', new Date())
      // })

      $('tr.blank-table-row').each(async (idx, element) => {
        const date = $(element).find('td.collapsible2').text().trim().slice(-2,)
        if (date) {
          if (+date >= 13) {
            const link = $(element).find('a').attr('href')
            queue.add(() => processUrl(link))

          }
         }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

start()