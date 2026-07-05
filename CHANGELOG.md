# Changelog
All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

- - -
## [v1.0.0](https://github.com/undertideco/nebulo-scraper/compare/13b007ac5ab95255a975f08a8c338b6e405865c7..v1.0.0) - 2026-07-05
#### Features
- port scraper to Go - ([3c93aac](https://github.com/undertideco/nebulo-scraper/commit/3c93aac4ccd08e3cb3702b8cf20e33f69de2c905)) - Duncan Leo
- write `output/_all.json` - ([4ed56fe](https://github.com/undertideco/nebulo-scraper/commit/4ed56fe6c10f0bf0ab76e809842c0ee91193506a)) - Duncan Leo
- migrate to Typescript - ([2048387](https://github.com/undertideco/nebulo-scraper/commit/20483875537b966c711c1835e3cc6cd99940bccd)) - Duncan Leo
#### Bug Fixes
- (**china**) handle broken location case - ([ecf226d](https://github.com/undertideco/nebulo-scraper/commit/ecf226d95ef1ea96eba7e1dff996d190a7527858)) - Duncan Leo
- (**ci**) outdated Node.js version and yarn usage - ([60ddb1e](https://github.com/undertideco/nebulo-scraper/commit/60ddb1e9e7440235a0225b1b1a1c2b6a7b6e977e)) - Duncan Leo
- (**ci**) pass `MOENV_API_KEY` - ([c6fb95a](https://github.com/undertideco/nebulo-scraper/commit/c6fb95a025fd4e0ed9acc688c0089cd0089d1d9f)) - Duncan Leo
- (**ci**) wrong field - ([3515716](https://github.com/undertideco/nebulo-scraper/commit/35157166dd93248a0d57770f7570eddfbf612a4f)) - Duncan Leo
- (**docker**) remove scraper and Postgres service - ([fc7800d](https://github.com/undertideco/nebulo-scraper/commit/fc7800d807e61a14ec9de1d8a6bc475d6cf7d120)) - Duncan Leo
- (**geocoder**) make Redis caching optional - ([951f725](https://github.com/undertideco/nebulo-scraper/commit/951f725a3dadd839be97e246d72039be9983c6d0)) - Duncan Leo
- (**hongKong**) switch XML parser - ([908e90b](https://github.com/undertideco/nebulo-scraper/commit/908e90b599d94ee2c9dfe0e5335bc30eb39d5dd0)) - Duncan Leo
- (**malaysia**) update broken API - ([f718249](https://github.com/undertideco/nebulo-scraper/commit/f7182497986869827bc131da389871a2046e05e0)) - Duncan Leo
- (**malaysia**) switch to newer API - ([f6f25de](https://github.com/undertideco/nebulo-scraper/commit/f6f25de7fdbfe896f7b4d59529db95de2e8f34ec)) - Duncan Leo
- (**taiwan**) update API - ([3853d2b](https://github.com/undertideco/nebulo-scraper/commit/3853d2b5e08370829cccc94c96cb163ff175b2ea)) - Duncan Leo
- (**taiwan**) switch to official MOENV API - ([ce5d10b](https://github.com/undertideco/nebulo-scraper/commit/ce5d10b459c1c6eed073ad212696c189083879f7)) - Duncan Leo
- (**taiwan**) updated URL - ([65487eb](https://github.com/undertideco/nebulo-scraper/commit/65487eb9ed5efce780ce7fc618dd14636e012540)) - Duncan Leo
- (**usa**) omit city with empty name - ([542f1b7](https://github.com/undertideco/nebulo-scraper/commit/542f1b7c7872c792d4b74edafbe7031862dc7752)) - Duncan Leo
- (**usa**) load dotenv config - ([9b27d11](https://github.com/undertideco/nebulo-scraper/commit/9b27d1167959afb64517e3d6abf33dfb26519f41)) - Duncan Leo
- tolerate upstream scraper payload changes - ([a679342](https://github.com/undertideco/nebulo-scraper/commit/a67934217b4a6701ca9f53f689a3b231327f1953)) - Duncan Leo
- run dotenv config before other imports - ([bbdb3ab](https://github.com/undertideco/nebulo-scraper/commit/bbdb3ab73f08bd5601e9468afafbb1f43497c84b)) - Duncan Leo
- .json file extension - ([6de76ce](https://github.com/undertideco/nebulo-scraper/commit/6de76ce4031890ffb1b52d041551936feebc24dd)) - Duncan Leo
- use hostname - ([f5b5af4](https://github.com/undertideco/nebulo-scraper/commit/f5b5af49cab1bef833527767f4742894d415cbba)) - Duncan Leo
- file extension in production - ([4c565b6](https://github.com/undertideco/nebulo-scraper/commit/4c565b6f01eeec61c9860f74a404c61628fc6c39)) - Duncan Leo
#### Documentation
- update README - ([a9766dc](https://github.com/undertideco/nebulo-scraper/commit/a9766dcfe73009046a8c35f8cf6c4bdbc41d6611)) - Duncan Leo
#### Build system
- (**ci**) update actions - ([955247d](https://github.com/undertideco/nebulo-scraper/commit/955247db40d52c163a0ebc3b31822588382a929c)) - Duncan Leo
- (**ci**) add test run workflow - ([540b371](https://github.com/undertideco/nebulo-scraper/commit/540b371adfad29988728a6b045ac2b52c9eb1a5c)) - Duncan Leo
- (**deps**) add 'tsx' - ([58c5bc1](https://github.com/undertideco/nebulo-scraper/commit/58c5bc15e111de1b945f0bc562e81429f3d1e7a7)) - Duncan Leo
- (**deps**) remove 'ts-node' - ([5b95dae](https://github.com/undertideco/nebulo-scraper/commit/5b95daefbe17ce05f95af0027aeee2142b47005b)) - Duncan Leo
- (**deps**) remove '@types/xml2js' - ([d6050a7](https://github.com/undertideco/nebulo-scraper/commit/d6050a7649d4cc06f24ba2a4b3ec0ce46de782d2)) - Duncan Leo
- (**deps**) remove 'xml2js' - ([52d8520](https://github.com/undertideco/nebulo-scraper/commit/52d852022bd073347cb60f9d4ba545282222f2f3)) - Duncan Leo
- (**deps**) add 'fast-xml-parser' - ([cc94604](https://github.com/undertideco/nebulo-scraper/commit/cc946041ffca855156245a67e1cf51a96b439c5a)) - Duncan Leo
- (**deps**) bump '@types/ioredis' to v5.0.0 - ([04f26c4](https://github.com/undertideco/nebulo-scraper/commit/04f26c4f708c28eaca96e7d391d3a40ff6aa3074)) - Duncan Leo
- (**deps**) bump 'ioredis' to v5.10.0 - ([b5b8dc2](https://github.com/undertideco/nebulo-scraper/commit/b5b8dc2c3e88277d7952deed3c12ce54a305cb05)) - Duncan Leo
- (**deps**) bump 'typescript' to v5.9.3 - ([4613eb5](https://github.com/undertideco/nebulo-scraper/commit/4613eb58fcb748cfd496998b097da8297879c984)) - Duncan Leo
- (**deps**) bump '@types/lodash' to v4.17.24 - ([839ef7c](https://github.com/undertideco/nebulo-scraper/commit/839ef7c32b3201b3df5d122386c98235015ec7b1)) - Duncan Leo
- (**deps**) bump 'lodash' to v4.17.23 - ([576eeb5](https://github.com/undertideco/nebulo-scraper/commit/576eeb5a6f63456157ec7681123b72de2d16c244)) - Duncan Leo
- (**deps**) bump 'axios' to v1.13.6 - ([08a07d2](https://github.com/undertideco/nebulo-scraper/commit/08a07d2a55388325b78f2396ff2b809e1e0653bd)) - Duncan Leo
- (**deps**) add '@biomejs/biome' - ([3140a76](https://github.com/undertideco/nebulo-scraper/commit/3140a767527cb97b45b5164f42958ec658ba6188)) - Duncan Leo
- (**deps**) remove 'prettier' - ([0de9301](https://github.com/undertideco/nebulo-scraper/commit/0de930166caba61d4ffef868f811c84f3f6b1be5)) - Duncan Leo
- (**deps**) remove '@typescript-eslint/parser' - ([e99ac5a](https://github.com/undertideco/nebulo-scraper/commit/e99ac5a274fb03f615572f8c2628b145b13c038d)) - Duncan Leo
- (**deps**) remove '@typescript-eslint/eslint-plugin' - ([8a4e66a](https://github.com/undertideco/nebulo-scraper/commit/8a4e66a1b1b76ea8053d4521f6e6e7bd01e399c8)) - Duncan Leo
- (**deps**) remove 'eslint' - ([8bffac3](https://github.com/undertideco/nebulo-scraper/commit/8bffac3e98f542b2dc8b0138bac183445d19036b)) - Duncan Leo
- (**deps**) remove 'eslint-plugin-simple-import-sort' - ([a0cfca0](https://github.com/undertideco/nebulo-scraper/commit/a0cfca03565e6e7224ed5bf2b556d9c1d20deb37)) - Duncan Leo
- (**deps**) remove 'eslint-plugin-import' - ([83008b8](https://github.com/undertideco/nebulo-scraper/commit/83008b8416507d68ebf3b6074bd1e16df5d5a4a1)) - Duncan Leo
- (**deps**) remove 'eslint-plugin-prettier' - ([d74fd84](https://github.com/undertideco/nebulo-scraper/commit/d74fd849776a081b2e7c661ca7d2ac069115665b)) - Duncan Leo
- (**deps**) remove 'eslint-config-prettier' - ([aea228e](https://github.com/undertideco/nebulo-scraper/commit/aea228eb63472aa409fa430a13fe14947595d14a)) - Duncan Leo
- (**deps**) switch from yarn to npm - ([e6e5692](https://github.com/undertideco/nebulo-scraper/commit/e6e5692e67229717de5c5b58d50d40039775051b)) - Duncan Leo
- (**deps**) bump 'ts-node' to v10.9.2 - ([e9f7208](https://github.com/undertideco/nebulo-scraper/commit/e9f7208cad528763d6cbc84e8b704af0ec27a83f)) - Duncan Leo
- (**deps**) bump '@types/node' to 16 - ([dc2c5a0](https://github.com/undertideco/nebulo-scraper/commit/dc2c5a0a6c1ef897cc8d9f7df422d14a3715ac86)) - Duncan Leo
- (**deps**) remove 'socks' - ([9bd721b](https://github.com/undertideco/nebulo-scraper/commit/9bd721bd6f3e476e8b2e294020d51188643f3911)) - Duncan Leo
- (**deps**) remove '@types/pg' - ([cb3b7c7](https://github.com/undertideco/nebulo-scraper/commit/cb3b7c76b1dfcdae5811cb038b97c7f5a2ba9fb3)) - Duncan Leo
- (**deps**) remove '@types/node-fetch' - ([4dbbdfa](https://github.com/undertideco/nebulo-scraper/commit/4dbbdfaf8b267fa53af842a1d60f398032016a27)) - Duncan Leo
- (**deps**) remove 'node-fetch' - ([30fb323](https://github.com/undertideco/nebulo-scraper/commit/30fb323f034a1d65a4eba714dd033c2d5ca4c0c3)) - Duncan Leo
- (**deps**) remove 'pg' - ([9b9578d](https://github.com/undertideco/nebulo-scraper/commit/9b9578de6f524226e96fd359fea0167e9fd55110)) - Duncan Leo
- (**deps**) remove 'cheerio' - ([b6d040b](https://github.com/undertideco/nebulo-scraper/commit/b6d040b0a810a7a0c7b9a2c487ab857e5971b49d)) - Duncan Leo
- (**deps**) upgrade 'typescript' to v4.9.4 - ([2108419](https://github.com/undertideco/nebulo-scraper/commit/21084193d60170ad54029759ca2ba2747ccef02a)) - Duncan Leo
- (**deps**) add 'axios' - ([7011408](https://github.com/undertideco/nebulo-scraper/commit/7011408672756496b5c8daec00f54e22a0ab36b3)) - Duncan Leo
- (**deps**) bump ansi-regex from 4.1.0 to 4.1.1 (#33) - ([37dfba0](https://github.com/undertideco/nebulo-scraper/commit/37dfba0d22f979f8831413fc8e66dd7aebd65e6d)) - dependabot[bot]
- (**deps**) bump minimatch from 3.0.4 to 3.1.2 (#32) - ([0236eb4](https://github.com/undertideco/nebulo-scraper/commit/0236eb48f61a19adedc60bf7fa660e57f11a95f2)) - dependabot[bot]
- (**deps**) bump node-fetch from 2.6.1 to 2.6.7 (#29) - ([593935c](https://github.com/undertideco/nebulo-scraper/commit/593935c609bd12536271892ec0d3b6bf22f343e3)) - dependabot[bot]
- (**deps**) bump path-parse from 1.0.5 to 1.0.7 (#25) - ([f855d34](https://github.com/undertideco/nebulo-scraper/commit/f855d3487b9683a4892ee1ea6459b0609e4d309d)) - dependabot[bot]
- (**deps**) bump lodash from 4.17.20 to 4.17.21 (#22) - ([07b319a](https://github.com/undertideco/nebulo-scraper/commit/07b319acbe5a1160da74a54bad6426329811a572)) - dependabot[bot]
- (**deps**) bump glob-parent from 5.1.1 to 5.1.2 (#24) - ([d589907](https://github.com/undertideco/nebulo-scraper/commit/d58990735c3eefad6b290acccaaf3db99f559bec)) - dependabot[bot]
- (**deps**) bump hosted-git-info from 2.5.0 to 2.8.9 (#23) - ([7e5d544](https://github.com/undertideco/nebulo-scraper/commit/7e5d5448376e4da51f2f2f4550c1586519909477)) - dependabot[bot]
- (**deps**) bump lodash.merge from 4.6.0 to 4.6.2 (#14) - ([7645682](https://github.com/undertideco/nebulo-scraper/commit/7645682526e0e565893243b34227fc235326b133)) - dependabot[bot]
- (**deps**) bump moment from 2.20.1 to 2.29.4 (#30) - ([650a86d](https://github.com/undertideco/nebulo-scraper/commit/650a86dbc3426fa1b51fc9af199557bd8474c146)) - dependabot[bot]
- (**deps**) bump css-what from 2.1.0 to 2.1.3 (#31) - ([982663d](https://github.com/undertideco/nebulo-scraper/commit/982663d5fdd93bd37b5a5d667b8c77f5d8c4f3b6)) - dependabot[bot]
- (**docker**) update Dockerfile - ([badf662](https://github.com/undertideco/nebulo-scraper/commit/badf662bbbe8a2ce1fdd5133aaa9b710cd93e923)) - Duncan Leo
- (**tsconfig**) set `ts-node.files=true` - ([81b92ef](https://github.com/undertideco/nebulo-scraper/commit/81b92ef0aeb485ff33ebe62971690f6653f0b397)) - Duncan Leo
- use Node.js v24 - ([d373acd](https://github.com/undertideco/nebulo-scraper/commit/d373acd88ad30b2ade1a3149c1a6161531bf03fc)) - Duncan Leo
- switch to Node.js v18 - ([e3d7ee3](https://github.com/undertideco/nebulo-scraper/commit/e3d7ee3795a7bd423983dbfa1cdea22f128a3543)) - Duncan Leo
- add workflow to build Docker image - ([9bc9808](https://github.com/undertideco/nebulo-scraper/commit/9bc9808648a2fedebeaabb99575a1df2a0e63e6b)) - Duncan Leo
#### Continuous Integration
- cache geocode results - ([03784c8](https://github.com/undertideco/nebulo-scraper/commit/03784c85c4d8ac82d907884b53c00fa2211b3ae2)) - Duncan Leo
- add cocogitto release workflow - ([3c21c27](https://github.com/undertideco/nebulo-scraper/commit/3c21c271f035cefda61e8ee0888ce8a580e7ff9c)) - Duncan Leo
#### Refactoring
- geocoder - ([edd908a](https://github.com/undertideco/nebulo-scraper/commit/edd908aecca44305c1c9b89bad9e50008017ee31)) - Duncan Leo
- modernise codebase - ([71bdbc6](https://github.com/undertideco/nebulo-scraper/commit/71bdbc6707f46e44520553c4e0992c34468fdadf)) - Duncan Leo
#### Miscellaneous Chores
- add Dependabot configuration - ([06d46b6](https://github.com/undertideco/nebulo-scraper/commit/06d46b66f524a209d804f72e6bbef03dec7f40e8)) - Duncan Leo
- remove obsolete TypeScript artifacts - ([93805de](https://github.com/undertideco/nebulo-scraper/commit/93805de7a4ab5aa66e3faab88445922fbddd6def)) - Duncan Leo
- switch to TSX - ([1a8c9fe](https://github.com/undertideco/nebulo-scraper/commit/1a8c9fe912385059d1dd973e9d9f9bf585f46cf1)) - Duncan Leo
- format all files with Biome - ([37024b5](https://github.com/undertideco/nebulo-scraper/commit/37024b54a55211c84138b2bc08f6fd19e5df802c)) - Duncan Leo
- configure VSCode - ([d017e47](https://github.com/undertideco/nebulo-scraper/commit/d017e47a09aa66d8ad574eb4e81359a359625435)) - Duncan Leo
- configure Biome - ([dd0df7f](https://github.com/undertideco/nebulo-scraper/commit/dd0df7f8a54d250f1be057242744a4d2bf1da2e8)) - Duncan Leo
- remove ESLint and Prettier config - ([553b06b](https://github.com/undertideco/nebulo-scraper/commit/553b06b50bad5501c543133750fcf07801742730)) - Duncan Leo
- update .gitignore - ([97ea8fc](https://github.com/undertideco/nebulo-scraper/commit/97ea8fc35124deae19d38e36eb812372f9eaf3e3)) - Duncan Leo
- output JSON files - ([a7ce187](https://github.com/undertideco/nebulo-scraper/commit/a7ce187b6f9d7ebb4e7317acc6b661ac82b0585e)) - Duncan Leo
- set DB pool max to 1 - ([f5eb4be](https://github.com/undertideco/nebulo-scraper/commit/f5eb4bef84751c06dff563e1bfa7e919b8df19b8)) - Duncan Leo

- - -

Changelog generated by [cocogitto](https://github.com/cocogitto/cocogitto).