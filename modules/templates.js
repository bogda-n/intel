const notebooks = (proc) => {
    return `
        \'${proc.model}, ${proc.family}, ${proc.cores}, ${proc.freq}, ${proc.boost}, ${proc.cache}, ${proc.manufacturer}, ${proc.graphics}, ${proc.graphicsModel}
        TAB T={{!LOOP}}
        \'Processor model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_49 CONTENT=%${proc.model}
        \'Processor family
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11560 CONTENT=%${proc.family}
        \'Processor cores
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_57809 CONTENT=%${proc.cores}
        \'Processor frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73715 CONTENT=${proc.freq}
        \'Processor boost frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_56907 CONTENT=${proc.boost}
        \'Processor cache
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_95853 CONTENT=${proc.cache}
        \'Processor manufacturer
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_2721 CONTENT=%${proc.manufacturer}
        \'On-board graphics adapter
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_74327 CONTENT=%${proc.graphics}
        \'On-board graphics adapter model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_53952 CONTENT=%${proc.graphicsModel}
    `.replace(/^\s+/gm, '')
}

const pcs = (proc) => {
    return `
       \'${proc.model}, ${proc.family}, ${proc.cores}, ${proc.freq}, ${proc.boost}, ${proc.cache}, ${proc.manufacturer}, ${proc.graphics}, ${proc.graphicsModel}
        TAB T={{!LOOP}}
        \'Processor model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62 CONTENT=%${proc.model}
        \'Processor family
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11561 CONTENT=%${proc.family}
        \'Processor cores
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_36486 CONTENT=%${proc.cores}
        \'Processor frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73716 CONTENT=${proc.freq}
        \'Processor boost frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_52264 CONTENT=${proc.boost}
        \'Processor cache
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_101563 CONTENT=${proc.cache}
        \'Processor manufacturer
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_3032 CONTENT=%${proc.manufacturer}
        \'On-board graphics adapter
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_74328 CONTENT=%${proc.graphics}
        \'On-board graphics adapter model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_53944 CONTENT=%${proc.graphicsModel}
    `.replace(/^\s+/gm, '')
}

const aios = (proc) => {
    return `
        \'${proc.model}, ${proc.family}, ${proc.cores}, ${proc.freq}, ${proc.boost}, ${proc.cache}, ${proc.manufacturer}, ${proc.graphics}, ${proc.graphicsModel}
        TAB T={{!LOOP}}
        \'Processor model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62592 CONTENT=%${proc.model}
        \'Processor family
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62591 CONTENT=%${proc.family}
        \'Processor cores
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62594 CONTENT=%${proc.cores}
        \'Processor frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73724 CONTENT=${proc.freq}
        \'Processor boost frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_62593 CONTENT=${proc.boost}
        \'Processor cache
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_62596 CONTENT=${proc.cache}
        \'Processor manufacturer
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_63185 CONTENT=%${proc.manufacturer}
        \'On-board graphics adapter
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_74333 CONTENT=%${proc.graphics}
        \'On-board graphics adapter model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_62736 CONTENT=%${proc.graphicsModel}
    `.replace(/^\s+/gm, '')
}

const servers = (proc) => {
    return `
        \'${proc.model}, ${proc.family}, ${proc.freq}, ${proc.boost}, ${proc.cache}, ${proc.manufacturer}, ${proc.graphics}, ${proc.graphicsModel}
        TAB T={{!LOOP}}
        \'Processor model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_1239 CONTENT=%${proc.model}
        \'Processor family
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11563 CONTENT=%${proc.family}
        \'Processor frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73717 CONTENT=${proc.freq}
        \'Processor boost frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_72626 CONTENT=${proc.boost}
        \'Processor cache
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_135262 CONTENT=${proc.cache}
        \'Processor manufacturer
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_4443 CONTENT=%${proc.manufacturer}
        \'On-board graphics adapter
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_64539 CONTENT=%${proc.graphics}
        \'On-board graphics adapter model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_134996 CONTENT=%${proc.graphicsModel}
    `.replace(/^\s+/gm, '')
}

const tablets = (proc) => {
    return `
        \'${proc.model}, ${proc.family}, ${proc.cores}, ${proc.freq}, ${proc.boost}, ${proc.manufacturer}
        TAB T={{!LOOP}}
        \'Processor model
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_6931 CONTENT=%${proc.model}
        \'Processor family
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_11580 CONTENT=%${proc.family}
        \'Processor cores
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_57773 CONTENT=%${proc.cores}
        \'Processor frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_73721 CONTENT=${proc.freq}
        \'Processor boost frequency
        TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:_rotate_value_91856 CONTENT=${proc.boost}
        \'Processor manufacturer
        TAG POS=1 TYPE=SELECT ATTR=ID:_rotate_value_102551 CONTENT=%${proc.manufacturer}
    `.replace(/^\s+/gm, '')
}

export { notebooks, pcs, aios, servers, tablets }