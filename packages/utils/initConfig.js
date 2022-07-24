import axios from 'axios'
import _ from 'lodash'
import { watch } from 'vue'

const FORMILACLASS = {}

// 将多个文本合并成一个文本
FORMILACLASS.CONCATENATE = (...strings) => strings.join('')

// 取得文本长度
FORMILACLASS.LEN = (string) => string.length

// 判断一个条件能否满足
FORMILACLASS.IF = (...string) => string[0]? string[1] : string[2]


export function getDefaultRules (schema, stateValue ) {

	for (const i of Object.keys(schema.properties)) {
		const rules = setupRules(schema.properties[i], stateValue)
		schema.properties[i].rules = rules
	}
}

function setupRules (field, stateValue) {
	let { rules } = field
	rules?.map(i => {
		let { validator, match, type, compile } = i

		if(match) {
			i.match = new RegExp(match)
			return 
		}	

		if(type === 'formula') {
			for (const j of Object.keys(FORMILACLASS)) {
				compile = compile?.replace(new RegExp(j, 'g'), `FORMILACLASS.${j}`)
			}
			validator = `(value, cb) => {
				const result = ${compile}
				if(result !== true) {
					cb('message')
				}
			}`
		}

		if(validator && typeof validator === 'string') {	
			validator = validator?.replace(/\${(\w+)}/g, (match, $1) => {
				return `stateValue.${$1}`
			})
	
			const result = new Function(
				'axios',
				'_',
				'FORMILACLASS',
				'stateValue',
				`return ${validator}`
			)

			i.validator = result(axios, _, FORMILACLASS, stateValue)
		}
	})
	
	return rules
}

