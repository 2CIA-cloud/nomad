/* AZIMUTE — js/modules/territory-units.js (Resolucao bairro/coordenada -> batalhao sem chute, unidades, 18o BPM, RMBH e Especializadas) */

        const AZIMUTE_HOSPITAIS_RMBH = [
            { id: "joao23", nome: "Hospital João XXIII (Referência Máxima Trauma)", lat: -19.9242, lon: -43.9317, routeUrl: "https://www.google.com/maps/dir/?api=1&destination=-19.9242,-43.9317&travelmode=driving" },
            { id: "hmc", nome: "Hosp. Municipal de Contagem (HMC)", lat: -19.9322, lon: -44.0758 },
            { id: "risoleta", nome: "Hosp. Risoleta Tolentino Neves (Venda Nova)", lat: -19.8195, lon: -43.9535 },
            { id: "odilon", nome: "Hosp. Municipal Odilon Behrens (BH)", lat: -19.9048, lon: -43.9482 },
            { id: "jk", nome: "Hosp. Júlia Kubitschek (Barreiro)", lat: -19.9897, lon: -44.0114 },
            { id: "betim", nome: "Hosp. Regional de Betim", lat: -19.9567, lon: -44.1925 }
        ];

        // Unidades Policiais (Batalhões e Companhias PMMG - funcionamento 24h)
        // Base na PMMG é "BSC" (Base de Segurança Comunitária) e NÃO é Unidade Policial (funciona apenas das 14:00 às 23:00)
        const AZIMUTE_UNIDADES_POLICIAIS = [
            { nome: "18º BPM • Sede / 133ª e 283ª Cia", endereco: "Av. João César de Oliveira, 5400 - Beatriz, Contagem", lat: -19.9162, lon: -44.0809, tipo: "unidade" },
            { nome: "131ª Cia PM (18º BPM - Ressaca)", endereco: "Rua Diamante, 950 - São Joaquim, Contagem", lat: -19.8885, lon: -44.0405, tipo: "unidade" },
            { nome: "BSC 18.131.1 • Praça do Divino (Base de Segurança Comunitária)", endereco: "Av. João Gomes Cardoso, 2244 - Jardim Laguna, Contagem", lat: -19.8842, lon: -44.0358, tipo: "bsc" },
            { nome: "BSC 18.131.3 • Shopping Contagem (Base de Segurança Comunitária)", endereco: "Av. Severino Ballesteros, 850 - São Joaquim, Contagem", lat: -19.8788, lon: -44.0321, tipo: "bsc" },
            { nome: "BSC Praça Silviano Brandão (Base de Segurança Comunitária)", endereco: "Praça Silviano Brandão - Centro, Contagem", lat: -19.9160, lon: -44.0858, tipo: "bsc" },
            { nome: "BSC Praça do Petrolândia (Base de Segurança Comunitária)", endereco: "Praça do Petrolândia - Petrolândia, Contagem", lat: -19.9340, lon: -44.1180, tipo: "bsc" },
            { nome: "38ª Cia PM Especial (18º BPM - Nova Contagem)", endereco: "Rua Maria José Chiodi, 960 - Nova Contagem", lat: -19.8350, lon: -44.1480, tipo: "unidade" },
            { nome: "BSC 18.38.1 • Nova Contagem (Base de Segurança Comunitária)", endereco: "Av. VP-1, 1375 - Nova Contagem", lat: -19.8312, lon: -44.1510, tipo: "bsc" },
            { nome: "39ª Cia PM (18º BPM - Kennedy / Ceasa)", endereco: "Av. Carandaí - Kennedy / Posto Ceasa, Contagem", lat: -19.8690, lon: -44.0430, tipo: "unidade" },
            { nome: "Batalhão GER (2ª RPM - Contagem)", endereco: "Rua Iguaçu, 233 - São Joaquim, Contagem", lat: -19.8895, lon: -44.0390, tipo: "unidade" },
            { nome: "39º BPM (Industrial / Eldorado - Contagem)", endereco: "Rua Tiradentes, 2750 - Industrial, Contagem", lat: -19.9540, lon: -44.0320, tipo: "unidade" },
            { nome: "66º BPM (Betim - Divisa 18º BPM)", endereco: "Rua Barão do Rio Branco, 235 - Centro, Betim", lat: -19.9610, lon: -44.1350, tipo: "unidade" },
            { nome: "33º BPM (Betim)", endereco: "Rua Conceição Rosa Lima, 455 - Angola, Betim", lat: -19.9670, lon: -44.1980, tipo: "unidade" },
            { nome: "40º BPM (Ribeirão das Neves)", endereco: "Rodovia LMG-806, KM 04 - Fazenda Castro, Neves", lat: -19.7670, lon: -44.0860, tipo: "unidade" },
            { nome: "48º BPM (Ibirité)", endereco: "Av. Marechal Hermes, 228 - Durval de Barros, Ibirité", lat: -20.0210, lon: -44.0580, tipo: "unidade" },
            { nome: "5º BPM / BEPE / BPChq (Gameleira - BH)", endereco: "Av. Amazonas, 6455 - Gameleira, BH", lat: -19.9320, lon: -43.9930, tipo: "unidade" },
            { nome: "BPTran / BPMRv (Gameleira - BH)", endereco: "Av. Amazonas, 6227 - Gameleira, BH", lat: -19.9310, lon: -43.9910, tipo: "unidade" },
            { nome: "34º BPM (Caiçara / Pampulha - BH)", endereco: "Av. Américo Vespúcio, 2391 - Caiçara, BH", lat: -19.8658, lon: -43.9711, tipo: "unidade" },
            { nome: "Batalhão ROTAM (Centro - BH)", endereco: "Av. do Contorno, 777 - Centro, BH", lat: -19.9142, lon: -43.9378, tipo: "unidade" },
            { nome: "1º BPM (Santa Efigênia - BH)", endereco: "Praça Floriano Peixoto, s/n - Santa Efigênia, BH", lat: -19.9220, lon: -43.9240, tipo: "unidade" },
            { nome: "16º BPM (Santa Tereza / Horto - BH)", endereco: "Rua Tenente Vitorino, 71 - Santa Tereza, BH", lat: -19.9083, lon: -43.9178, tipo: "unidade" },
            { nome: "22º BPM (Santa Lúcia - BH)", endereco: "Av. Arthur Bernardes, 1337 - Santa Lúcia, BH", lat: -19.9460, lon: -43.9300, tipo: "unidade" },
            { nome: "41º BPM (Barreiro - BH)", endereco: "Av. Afonso Vaz de Melo, 650 - Barreiro, BH", lat: -19.9760, lon: -44.0180, tipo: "unidade" },
            { nome: "13º BPM (Planalto - BH)", endereco: "Av. Dr. Cristiano Guimarães, 2300 - Planalto, BH", lat: -19.8320, lon: -43.9450, tipo: "unidade" },
            { nome: "49º BPM (Venda Nova - BH)", endereco: "Av. Érico Veríssimo, 561 - São João Batista, BH", lat: -19.8140, lon: -43.9680, tipo: "unidade" },
            { nome: "BOPE / ROCCA (Prado - BH)", endereco: "Rua Diabase, 200 - Prado, BH", lat: -19.9265, lon: -43.9615, tipo: "unidade" },
            { nome: "RCAT Cavalaria (Prado - BH)", endereco: "Rua Platina, 580 - Prado, BH", lat: -19.9240, lon: -43.9640, tipo: "unidade" }
        ];

        // Regra de horário das BSCs (Base de Segurança Comunitária):
        // Das 14:00 às 23:00 (inclusive): BSCs ativas.
        // Das 23:01 às 13:59 (fora do horário): ignora todas as BSCs e considera apenas Unidades Policiais (Batalhão ou Companhia).
        function isAzimuteBscActiveNow(nowDate = new Date()) {
            const totalMins = nowDate.getHours() * 60 + nowDate.getMinutes();
            return totalMins >= (14 * 60) && totalMins <= (23 * 60);
        }

        const AZIMUTE_PONTOS_ABASTECIMENTO = [
            { nome: "18º BPM (Sede Contagem)", endereco: "Av. João César de Oliveira, 5400 - Beatriz, Contagem", lat: -19.9162, lon: -44.0809 },
            { nome: "2º Batalhão de Bombeiros (2º BBM)", endereco: "Av. João César de Oliveira, 3744 - Eldorado, Contagem", lat: -19.9298, lon: -44.0542 },
            { nome: "Posto ALE (ZQC Padre Feijó - Apoio 131ª Cia)", endereco: "Av. João Gomes Cardoso, 1366 - Jardim Laguna, Contagem", lat: -19.8868, lon: -44.0381 },
            { nome: "40º BPM (Ribeirão das Neves)", endereco: "Rodovia LMG-806, KM 04 - Fazenda Castro, Neves", lat: -19.7670, lon: -44.0860 },
            { nome: "Batalhão ROTAM (CME - 1ª RPM)", endereco: "Av. do Contorno, 777 - Centro, BH", lat: -19.9142, lon: -43.9378 },
            { nome: "5º BPM (Sede Gameleira • Horário Comercial)", endereco: "Av. Amazonas, 6455 - Gameleira, BH", lat: -19.9320, lon: -43.9930 },
            { nome: "34º BPM (Sede Caiçara - 1ª RPM)", endereco: "Av. Américo Vespúcio, 2391 - Caiçara, BH", lat: -19.8658, lon: -43.9711 },
            { nome: "1º BPM (Sede Santa Efigênia - 1ª RPM)", endereco: "Praça Floriano Peixoto, s/n - Santa Efigênia, BH", lat: -19.9220, lon: -43.9240 },
            { nome: "16º BPM (Sede Santa Tereza - 1ª RPM)", endereco: "Rua Tenente Vitorino, 71 - Santa Tereza, BH", lat: -19.9083, lon: -43.9178 },
            { nome: "22º BPM (Sede Santa Lúcia - 1ª RPM)", endereco: "Av. Arthur Bernardes, 1337 - Santa Lúcia, BH", lat: -19.9460, lon: -43.9300 },
            { nome: "13º BPM (Sede Planalto - 1ª RPM)", endereco: "Av. Dr. Cristiano Guimarães, 2300 - Planalto, BH", lat: -19.8320, lon: -43.9450 }
        ];

        const AZIMUTE_AREAS_RADIO = [
            { unidade: "18º BPM • 133ª Cia (Sede/Centro Contagem)", rede: "REDE: 2ª RPM / 18º BPM A", lat: -19.9162, lon: -44.0809 },
            { unidade: "18º BPM • 131ª Cia (Ressaca / Laguna)", rede: "REDE: 2ª RPM / 18º BPM A", lat: -19.8885, lon: -44.0405 },
            { unidade: "18º BPM • 39ª Cia (Nacional / Ceasa)", rede: "REDE: 2ª RPM / 18º BPM A", lat: -19.8690, lon: -44.0430 },
            { unidade: "18º BPM • 283ª Cia (Petrolândia)", rede: "REDE: 2ª RPM / 18º BPM A", lat: -19.9340, lon: -44.1180 },
            { unidade: "18º BPM • 38ª Cia Esp. (Nova Contagem)", rede: "REDE: 2ª RPM / 18º BPM A", lat: -19.8350, lon: -44.1480 },
            { unidade: "39º BPM (Industrial / Eldorado - Contagem)", rede: "REDE: 2ª RPM / 39º BPM", lat: -19.9540, lon: -44.0320 },
            { unidade: "66º BPM (Betim - Divisa 18º BPM)", rede: "REDE: 2ª RPM / 66º BPM", lat: -19.9610, lon: -44.1350 },
            { unidade: "33º BPM (Betim Centro)", rede: "REDE: 2ª RPM / 33º BPM", lat: -19.9670, lon: -44.1980 },
            { unidade: "40º BPM (Ribeirão das Neves)", rede: "REDE: 2ª RPM / 40º BPM", lat: -19.7670, lon: -44.0860 },
            { unidade: "48º BPM (Ibirité)", rede: "REDE: 2ª RPM / 48º BPM", lat: -20.0210, lon: -44.0580 },
            { unidade: "5º BPM (BH Oeste / Gameleira / Arena MRV)", rede: "REDE: 1ª RPM / 5º BPM A", lat: -19.9320, lon: -43.9930 },
            { unidade: "34º BPM (BH Noroeste / Pampulha / Mineirão)", rede: "REDE: 1ª RPM / 34º BPM B", lat: -19.8658, lon: -43.9711 },
            { unidade: "16º BPM (BH Leste / Horto / Independência)", rede: "REDE: 1ª RPM / 16º BPM A", lat: -19.9083, lon: -43.9178 },
            { unidade: "22º BPM (BH Centro-Sul / Aglomerados)", rede: "REDE: 1ª RPM / 22º BPM", lat: -19.9460, lon: -43.9300 },
            { unidade: "1º BPM (BH Centro / Santa Efigênia)", rede: "REDE: 1ª RPM / 1º BPM", lat: -19.9220, lon: -43.9350 },
            { unidade: "41º BPM (BH Barreiro)", rede: "REDE: 1ª RPM / 41º BPM", lat: -19.9760, lon: -44.0180 },
            { unidade: "13º BPM (BH Planalto / Norte)", rede: "REDE: 1ª RPM / 13º BPM", lat: -19.8320, lon: -43.9450 },
            { unidade: "49º BPM (BH Venda Nova)", rede: "REDE: 1ª RPM / 49º BPM", lat: -19.8140, lon: -43.9680 }
        ];

        let azimuteWatchId = null;
        let azimuteLastGeoLat = null;
        let azimuteLastGeoLon = null;
        let azimuteLastLookupTime = 0;
        let azimuteLastWeatherTime = 0;
        let azimuteLastStreet = "Sincronizando endereço via satélite...";
        let azimuteCurrentSuburb = "";
        let azimuteCurrentCity = "";

        // Base verificada de jurisdição Bairro -> Batalhão/Cia/Rede (consulta prioritária em AZIMUTE_DB e fallback apenas nesta base verificada, nunca por chute de distância)
        const AZIMUTE_VERIFIED_BAIRROS_INDEX = [
            // 22º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "22º BPM", cia: "124ª Cia", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 22º BPM A", bairros: ["Morro do Papagaio", "Santa Lúcia", "Santo Antônio", "Belvedere", "Santa Rita de Cássia", "Vila Barragem Santa Lúcia", "Vila Estrela", "Cidade Jardim", "São Bento", "São Pedro"] },
            { bpm: "22º BPM", cia: "125ª Cia", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 22º BPM A", bairros: ["Morro das Pedras", "Prado", "Nova Suíssa", "Nova Suissa", "Gutierrez", "Calafate", "Vila Santa Sofia", "Vila São Jorge", "Vila Leonina", "Jardim América", "Nova Granada", "Barroca", "Grajaú"] },
            { bpm: "22º BPM", cia: "127ª Cia", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 22º BPM A", bairros: ["Aglomerado da Serra", "Serra", "Sion", "Cruzeiro", "Vila Nossa Senhora de Fátima", "Vila Marçola", "Vila Marcola", "Vila Santana do Cafezal", "Mangabeiras", "São Lucas", "Carmo", "Anchieta"] },
            { bpm: "22º BPM", cia: "128ª Cia", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 22º BPM A", bairros: ["Alto Vera Cruz", "Paraíso", "Saudade", "Esplanada", "Conjunto Taquaril", "Taquaril", "Santa Efigênia", "Pompéia"] },
            // 5º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "5º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 5º BPM A", bairros: ["Gameleira", "Nova Gameleira", "Califórnia", "Camargos", "Coracao Eucaristico", "Coração Eucarístico", "Dom Bosco", "Dom Cabral", "João Pinheiro", "Madre Gertrudes", "Minas Brasil", "Nova Cintra", "Nova Vista", "Padre Eustáquio", "Salgado Filho", "Betânia", "Cabana do Pai Tomás", "Estrela do Oriente", "Havaí", "Vista Alegre", "Oeste", "Conjunto Califórnia"] },
            // 1º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "1º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 1º BPM", bairros: ["Centro", "Savassi", "Funcionários", "Lourdes", "Barro Preto", "Carlos Prates", "Floresta", "Boa Viagem", "Lagoinha"] },
            // 16º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "16º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 16º BPM A", bairros: ["Santa Tereza", "Horto", "Horto Florestal", "Sagrada Família", "Cidade Nova", "Silveira", "Nova Floresta", "União", "Bairro da Graça", "Colégio Batista", "Renascença", "São Geraldo", "Boa Vista", "Casa Branca", "Santa Inês"] },
            // 34º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "34º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 34º BPM B", bairros: ["Caiçara", "Caiçaras", "Alípio de Melo", "Castelo", "Ouro Preto", "Paquetá", "São José", "Pampulha", "São Luiz", "Bandeirantes", "Santa Amélia", "Santa Branca", "Itapoã", "Jardim Atlântico", "Serrano", "Glória", "Coqueiros", "Pindorama"] },
            // 41º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "41º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 41º BPM", bairros: ["Barreiro", "Barreiro de Baixo", "Barreiro de Cima", "Cardoso", "Diamante", "Milionários", "Lindéia", "Tirol", "Teixeira Dias", "Vila Pinho", "Vale do Jatobá", "Bonsucesso", "Olaria", "Santa Helena"] },
            // 13º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "13º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 13º BPM", bairros: ["Planalto", "Guarani", "Tupi", "Aarão Reis", "Floramar", "Heliópolis", "Jaqueline", "Jardim Guanabara", "Providência", "São Bernardo", "Vila Clóris"] },
            // 49º BPM (Belo Horizonte - 1ª RPM)
            { bpm: "49º BPM", cia: "", cidade: "Belo Horizonte", rede: "REDE: 1ª RPM / 49º BPM", bairros: ["Venda Nova", "Céu Azul", "Copacabana", "Jardim dos Comerciários", "Justinópolis", "Letícia", "Mantiqueira", "Piratininga", "Rio Branco", "Santa Mônica", "São João Batista", "Serra Verde"] },
            // 18º BPM (Contagem - 2ª RPM)
            { bpm: "18º BPM", cia: "133ª Cia", cidade: "Contagem", rede: "REDE: 2ª RPM / 18º BPM A", bairros: ["Centro", "Sede", "Fonte Grande", "Nossa Senhora do Carmo", "Bernardo Monteiro", "Alvorada", "Camilo Alves", "Santa Helena", "Colonial", "Praia", "Três Barras"] },
            { bpm: "18º BPM", cia: "131ª Cia", cidade: "Contagem", rede: "REDE: 2ª RPM / 18º BPM A", bairros: ["Ressaca", "Laguna", "Cabral", "Arpoador", "São Joaquim", "Candida Ferreira", "Guanabara", "Colorado", "Oitis", "Morada Nova"] },
            { bpm: "18º BPM", cia: "39ª Cia", cidade: "Contagem", rede: "REDE: 2ª RPM / 18º BPM A", bairros: ["Nacional", "Pedra Azul", "Xangri-lá", "Xangrila", "Vila Boa Vista", "Confisco", "Tijuco", "Estrela Dalva", "Bom Jesus", "Vale das Amendoeiras"] },
            { bpm: "18º BPM", cia: "283ª Cia", cidade: "Contagem", rede: "REDE: 2ª RPM / 18º BPM A", bairros: ["Petrolândia", "Sapucaias", "Tropical", "São Luiz", "Industrial São Luiz", "Beija-Flor", "Duque de Caxias", "Campo Alto"] },
            { bpm: "18º BPM", cia: "38ª Cia Esp.", cidade: "Contagem", rede: "REDE: 2ª RPM / 18º BPM A", bairros: ["Nova Contagem", "Ipê Amarelo", "Vila Renascer", "Retiro", "Vila Nova Esperança", "Estância do Hibisco", "Icaivera", "Darcy Ribeiro"] },
            // 39º BPM (Contagem - 2ª RPM)
            { bpm: "39º BPM", cia: "", cidade: "Contagem", rede: "REDE: 2ª RPM / 39º BPM", bairros: ["Eldorado", "Industrial", "Riacho das Pedras", "Novo Riacho", "Inconfidentes", "Agua Branca", "Água Branca", "Cidade Industrial", "Amazonas", "Bandeirantes", "Flamengo", "Monte Castelo", "Parque São João", "Santa Cruz Industrial"] }
        ];

        function azNormTerritoryName(s) {
            return String(s || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function azStripTerritoryPrefix(s) {
            return azNormTerritoryName(s).replace(/^(bairro|vila|conjunto|aglomerado|jardim|parque)\s+/i, '').trim();
        }

        function azCityMatches(unitCity, queryCity) {
            const nc = azNormTerritoryName(queryCity);
            const nu = azNormTerritoryName(unitCity);
            if (!nc || !nu || nc === 'rmbh' || nu === 'rmbh') return true;
            return nu.includes(nc) || nc.includes(nu);
        }

        function resolveTerritorialJurisdiction(suburbStr, cityStr) {
            const rawSub = String(suburbStr || '').trim();
            const rawCity = String(cityStr || '').trim();
            const normSub = azNormTerritoryName(rawSub);
            const coreSub = azStripTerritoryPrefix(rawSub);

            if (!normSub) {
                return {
                    confirmed: false,
                    battalion: null,
                    cia: null,
                    rede: 'Aguardando GPS',
                    unidade: 'Aguardando confirmação de bairro/GPS',
                    headerLabel: 'Aguardando bairro/GPS'
                };
            }

            // 1. Consulta prioritária na base carregada (AZIMUTE_DB: dados.json, batalhao_22.json, etc.)
            if (typeof AZIMUTE_DB !== 'undefined' && AZIMUTE_DB) {
                const allUnits = Array.isArray(AZIMUTE_DB.all) && AZIMUTE_DB.all.length
                    ? AZIMUTE_DB.all
                    : [...(AZIMUTE_DB.rpm1 || []), ...(AZIMUTE_DB.rpm2 || [])];

                // Duas passadas: 1ª exigindo compatibilidade de cidade, 2ª apenas se cidade genérica
                for (let pass = 0; pass < 2; pass++) {
                    for (const u of allUnits) {
                        if (pass === 0 && !azCityMatches(u.cidade, rawCity)) continue;
                        for (const c of (u.companhias || [])) {
                            const exactHit = (c.bairros || []).some(b => {
                                const nb = azNormTerritoryName(b);
                                const cb = azStripTerritoryPrefix(b);
                                return (nb && nb === normSub) || (cb && coreSub && cb === coreSub && nb.length >= 4);
                            });
                            if (exactHit) {
                                const ciaShort = (c.nome || '').replace(/\s*PM$/i, '').replace(/Companhia/i, 'Cia').replace(/ESPECIAL/i, 'Esp.').trim();
                                const redeVal = u.rede_radio || ('REDE: ' + u.nome);
                                return {
                                    confirmed: true,
                                    battalion: u.nome,
                                    cia: ciaShort,
                                    rede: redeVal,
                                    unidade: (ciaShort ? (u.nome + ' • ' + ciaShort) : u.nome) + ' (' + rawSub + (rawCity ? ' - ' + rawCity : '') + ')',
                                    headerLabel: ciaShort ? (ciaShort + ' / ' + u.nome) : u.nome
                                };
                            }
                        }
                    }
                }
            }

            // 2. Consulta na tabela verificada de bairros (sem chute por distância)
            for (let pass = 0; pass < 2; pass++) {
                for (const entry of AZIMUTE_VERIFIED_BAIRROS_INDEX) {
                    if (pass === 0 && !azCityMatches(entry.cidade, rawCity)) continue;
                    const hit = entry.bairros.some(b => {
                        const nb = azNormTerritoryName(b);
                        const cb = azStripTerritoryPrefix(b);
                        return (nb && nb === normSub) || (cb && coreSub && cb === coreSub && nb.length >= 4);
                    });
                    if (hit) {
                        return {
                            confirmed: true,
                            battalion: entry.bpm,
                            cia: entry.cia,
                            rede: entry.rede,
                            unidade: (entry.cia ? (entry.bpm + ' • ' + entry.cia) : entry.bpm) + ' (' + rawSub + (rawCity ? ' - ' + rawCity : '') + ')',
                            headerLabel: entry.cia ? (entry.cia + ' / ' + entry.bpm) : entry.bpm
                        };
                    }
                }
            }

            // 3. Regra de incerteza: não inventar nem chutar outro batalhão
            return {
                confirmed: false,
                battalion: null,
                cia: null,
                rede: 'Não confirmada na base',
                unidade: 'Batalhão não consta na base (' + rawSub + (rawCity ? ' - ' + rawCity : '') + ')',
                headerLabel: 'Batalhão não consta na base'
            };
        }

        function azimuteCalcDistKm(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        }

        // Calcula o tempo médio de deslocamento (em minutos) considerando fator viário urbano (~1.3x a distância linear)
        function calcEstimatedDriveMinutes(linearKm) {
            const roadKm = linearKm * 1.3;
            // Velocidade média estimada em deslocamento prioritário urbano: ~48 km/h (0.8 km/min)
            const mins = Math.max(1, Math.round(roadKm / 0.8));
            return { roadKm: roadKm.toFixed(1), mins: mins };
        }

        let azimuteCurrentClosestArea = { confirmed: false, battalion: null, cia: null, unidade: "Aguardando confirmação de bairro/GPS", rede: "Aguardando GPS", headerLabel: "Aguardando bairro/GPS" };

        // Resume o texto da Rede para a Barra de Status (ex: "REDE: 2ª RPM / 18º BPM A" -> "18º BPM A")
        function formatShortRedeName(fullRede) {
            if (!fullRede) return 'Aguardando GPS';
            if (/não confirmad|nao confirmad|aguardando/i.test(fullRede)) return fullRede;
            let s = fullRede.replace(/^REDE:\s*/i, '').trim();
            if (s.includes('/')) {
                s = s.split('/').pop().trim();
            }
            return s;
        }

        // Atualiza o indicador "GPS"na Barra de Status e no Cockpit do Modo GRID: VERDE, AMARELO, VERMELHO PISCANDO
        function setStatusBarGpsSignal(level) {
            const ind = document.getElementById('statusBarGpsIndicator');
            const gBadge = document.getElementById('gridGpsBadge');
            const gDot = document.getElementById('gridGpsDot');
            const gTxt = document.getElementById('gridGpsText');
            if (ind) {
                ind.textContent = 'GPS';
                ind.className = 'px-2.5 py-1 rounded font-mono font-extrabold text-[11px] uppercase tracking-wider border bg-emerald-950/90 text-emerald-400 border-emerald-500/60 shrink-0 transition-all cursor-pointer';
            }
            if (gBadge && gDot && gTxt) {
                if (level === 'green') {
                    gBadge.className = 'px-2 py-0.5 rounded font-mono font-extrabold text-[10px] uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/60 flex items-center gap-1';
                    gDot.className = 'w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399]';
                    gTxt.textContent = 'GPS BOM';
                } else if (level === 'yellow') {
                    gBadge.className = 'px-2 py-0.5 rounded font-mono font-extrabold text-[10px] uppercase bg-amber-950 text-amber-300 border border-amber-500/60 flex items-center gap-1';
                    gDot.className = 'w-2 h-2 rounded-full bg-amber-400 inline-block';
                    gTxt.textContent = 'GPS MOD';
                } else {
                    gBadge.className = 'px-2 py-0.5 rounded font-mono font-extrabold text-[10px] uppercase bg-red-950 text-red-400 border border-red-500/70 animate-pulse flex items-center gap-1';
                    gDot.className = 'w-2 h-2 rounded-full bg-red-400 inline-block';
                    gTxt.textContent = 'SEM SINAL';
                }
            }
        }

        function setGpsOnlineState(isOnline, customLabel, accuracyMeters) {
            const badge = document.getElementById('hudGpsBadge');
            const dot = document.getElementById('hudGpsDot');
            const txt = document.getElementById('hudGpsStatusText');
            const hBadge = document.getElementById('homeGpsBadge');
            const hDot = document.getElementById('homeGpsDot');
            const hTxt = document.getElementById('homeGpsStatusText');

            if (isOnline && navigator.onLine !== false) {
                if (badge) badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/50';
                if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]';
                if (txt) txt.textContent = customLabel || 'GPS';
                if (hBadge) hBadge.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/50';
                if (hDot) hDot.className = 'w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399]';
                if (hTxt) hTxt.textContent = 'GPS';

                if (typeof accuracyMeters === 'number') {
                    setStatusBarGpsSignal(accuracyMeters <= 30 ? 'green' : 'yellow');
                } else {
                    setStatusBarGpsSignal('green');
                }
            } else {
                if (badge) badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-500/50';
                if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 inline-block';
                if (txt) txt.textContent = customLabel || 'GPS Offline (Cache Local)';
                if (hBadge) hBadge.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-500/50';
                if (hDot) hDot.className = 'w-2 h-2 rounded-full bg-amber-400 inline-block';
                if (hTxt) hTxt.textContent = 'GPS Offline';
                setStatusBarGpsSignal('red');
            }
        }

        function formatFullStatusBarQth(street, suburbRaw) {
            if (!street) return '--';
            if (!suburbRaw) return street;
            const cleanSuburbCity = String(suburbRaw)
                .replace(/\s*•\s*CEP:.*$/i, '')
                .split('•')
                .map(s => s.trim())
                .filter(Boolean)
                .join(' - ');
            if (!cleanSuburbCity) return street;
            if (street.toLowerCase().includes(cleanSuburbCity.toLowerCase())) return street;
            return street + ' • ' + cleanSuburbCity;
        }

        // Salva e restaura o último QTH válido no LocalStorage

        function evaluateAzimuteHospitalRanking(lat, lon) {
            const ranked = AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS.map(h => {
                const linearKm = azimuteCalcDistKm(lat, lon, h.lat, h.lon);
                const est = calcEstimatedDriveMinutes(linearKm);
                const routeUrl = h.routeUrl ? h.routeUrl : ('https://www.google.com/maps/dir/?api=1&destination=' + h.lat + ',' + h.lon + '&travelmode=driving');
                return {
                    ...h,
                    linearKm,
                    roadKm: parseFloat(est.roadKm),
                    roadKmStr: est.roadKm,
                    mins: est.mins,
                    routeUrl
                };
            }).sort((a, b) => {
                const diff = a.linearKm - b.linearKm;
                // Critério de desempate imediato: Hospital João XXIII tem prioridade máxima
                if (Math.abs(diff) <= 0.15) {
                    if (a.id === 'joao23') return -1;
                    if (b.id === 'joao23') return 1;
                }
                return diff;
            });

            const closest = ranked[0];
            const joao23 = ranked.find(h => h.id === 'joao23') || closest;

            let indicated = closest;
            let usedJoao23PriorityRule = false;
            const diffRoadKm = joao23.roadKm - closest.roadKm;
            const diffLinearKm = joao23.linearKm - closest.linearKm;

            // REGRA DO JOÃO XXIII: Referência máxima; se for o mais próximo, empatar ou estiver a até 2 km - 3 km de diferença do hospital mais próximo, indica o João XXIII
            if (closest.id === 'joao23') {
                indicated = joao23;
            } else if (diffRoadKm <= 3.0 || diffLinearKm <= 3.0) {
                indicated = joao23;
                usedJoao23PriorityRule = true;
            }

            // As demais opções permanecem em ordem estritamente crescente de distância
            const otherOptions = ranked.filter(h => h.id !== indicated.id).sort((a, b) => a.linearKm - b.linearKm);

            return {
                indicated,
                otherOptions,
                ranked,
                closest,
                usedJoao23PriorityRule,
                diffRoadKm: Math.max(0, diffRoadKm).toFixed(1)
            };
        }

        function updateSaudeSmartHospitalComparison(lat, lon, closestArea) {
            if (!AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS || !AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS.length) return;

            const evalRes = evaluateAzimuteHospitalRanking(lat, lon);
            const ind = evalRes.indicated;
            const others = evalRes.otherOptions;

            // 1. Atualiza o Bloco "HOSPITAL INDICADO:"
            const tagEl = document.getElementById('saudeIndicatedTag');
            const distEl = document.getElementById('saudeIndicatedDistBadge');
            const nameEl = document.getElementById('saudeIndicatedName');
            const addrEl = document.getElementById('saudeIndicatedAddr');
            const reasonEl = document.getElementById('saudeIndicatedReasonText');
            const phoneBtn = document.getElementById('saudeIndicatedPhoneBtn');
            const phoneTxt = document.getElementById('saudeIndicatedPhoneText');
            const routeBtn = document.getElementById('saudeIndicatedRouteBtn');
            const headerSub = document.getElementById('saudeUnifiedHeaderSub');

            if (tagEl) tagEl.textContent = ind.selo || 'HOSPITAL INDICADO';
            if (distEl) distEl.textContent = '~' + ind.roadKmStr + ' km • ~' + ind.mins + ' min';
            if (nameEl) nameEl.textContent = ind.nome;
            if (addrEl) addrEl.textContent = ind.endereco;
            if (phoneBtn && ind.telefone) {
                phoneBtn.href = 'tel:0' + ind.telefone.replace(/\D/g, '');
            }
            if (phoneTxt) phoneTxt.textContent = ind.telefone || '(31) 3239-9200';
            if (routeBtn) routeBtn.href = ind.routeUrl;
            if (headerSub) {
                headerSub.textContent = 'Indicado agora: ' + ind.nome + ' (~' + ind.roadKmStr + ' km • ~' + ind.mins + ' min)';
            }

            if (reasonEl) {
                if (ind.id === 'joao23' && evalRes.usedJoao23PriorityRule) {
                    reasonEl.textContent = 'Indicado pela Regra de Referência Máxima: diferença de apenas ~' + evalRes.diffRoadKm + ' km (≤ 3 km) em relação ao ' + evalRes.closest.nome + '.';
                } else if (ind.id === 'joao23') {
                    reasonEl.textContent = 'Referência máxima estadual em politrauma e hospital mais próximo da sua coordenada GPS atual.';
                } else {
                    reasonEl.textContent = 'Unidade hospitalar de referência mais próxima da sua coordenada GPS atual (linear: ' + ind.linearKm.toFixed(1) + ' km).';
                }
            }

            // 2. Atualiza o Bloco "OUTRAS OPÇÕES:" em ordem crescente de distância
            const othersContainer = document.getElementById('saudeOtherHospitalsList');
            if (othersContainer) {
                othersContainer.innerHTML = others.map((h, idx) => {
                    const telClean = (h.telefone || '').replace(/\D/g, '');
                    const isJoao = h.id === 'joao23';
                    return `
                        <div class="bg-[#0D0D0D] p-4 rounded-xl border ${isJoao ? 'border-[#C5A869]/70' : 'border-pmmg-border'} flex flex-col justify-between space-y-3 transition-all">
                            <div class="space-y-1">
                                <div class="flex items-center justify-between gap-2 flex-wrap">
                                    <span class="text-[10px] font-mono font-bold uppercase ${isJoao ? 'bg-pmmg-khakiBadge text-pmmg-khaki border border-[#C5A869]/40' : 'bg-[#161616] text-gray-300 border border-pmmg-border'} px-2 py-0.5 rounded">
                                        ${idx + 1}º • ${h.selo || 'Referência Regional'}
                                    </span>
                                    <span class="text-xs font-mono font-extrabold text-pmmg-khaki bg-[#161616] px-2.5 py-0.5 rounded border border-[#C5A869]/40">
                                        ~${h.roadKmStr} km • ~${h.mins} min
                                    </span>
                                </div>
                                <h4 class="text-xl font-military text-white uppercase tracking-wide pt-0.5">${h.nome}</h4>
                                <p class="text-xs text-gray-400 leading-snug">${h.endereco}</p>
                            </div>
                            <div class="pt-2.5 border-t border-pmmg-border flex items-center justify-between gap-2 text-xs">
                                <a href="tel:0${telClean}" class="text-pmmg-khaki font-mono font-bold hover:underline flex items-center gap-1">
                                    <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                                    <span>${h.telefone || '--'}</span>
                                </a>
                                <a href="${h.routeUrl}" target="_blank" class="px-3.5 py-1.5 bg-[#161616] hover:bg-pmmg-cardHover text-pmmg-khaki border border-[#C5A869]/60 rounded-lg font-extrabold uppercase flex items-center gap-1.5 transition-all">
                                    <i data-lucide="navigation" class="w-3.5 h-3.5 text-pmmg-gold"></i>
                                    <span>Rota</span>
                                </a>
                            </div>
                        </div>
                    `;
                }).join('');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            // Mantém elementos ocultos de compatibilidade atualizados
            const refNameEl = document.getElementById('saudeRefHospName');
            const closestNameEl = document.getElementById('saudeClosestHospName');
            if (refNameEl) refNameEl.textContent = ind.nome;
            if (closestNameEl) closestNameEl.textContent = ind.nome;
        }

        function updateOfflineProximityData(lat, lon, acc) {
            // 1. Hospital Indicado pela Regra Unificada (GPS contínuo + Prioridade João XXIII até 3 km, sem HPM como trauma)
            const hospEval = evaluateAzimuteHospitalRanking(lat, lon);
            const closestHosp = hospEval.indicated;
            const minHospDist = closestHosp.linearKm;
            const driveEst = { roadKm: closestHosp.roadKmStr, mins: closestHosp.mins };
            const hospUrl = closestHosp.routeUrl;

            const hNameEl = document.getElementById('hudClosestHospital');
            const hDistEl = document.getElementById('hudClosestHospitalDist');
            const miniBtn = document.getElementById('hudBtnHospRouteMini');
            if (hNameEl) hNameEl.textContent = closestHosp.nome;
            if (hDistEl) hDistEl.textContent = 'Distância: ~' + driveEst.roadKm + 'km • Tempo médio: ~' + driveEst.mins + 'min';
            if (miniBtn) {
                miniBtn.classList.remove('hidden');
                miniBtn.href = hospUrl;
            }

            // 2. Canaleta de Rádio e Batalhão pela jurisdição real do bairro (sem chute por distância)
            const resolvedJurisdiction = resolveTerritorialJurisdiction(azimuteCurrentSuburb, azimuteCurrentCity);
            const closestArea = {
                confirmed: resolvedJurisdiction.confirmed,
                battalion: resolvedJurisdiction.battalion,
                cia: resolvedJurisdiction.cia,
                unidade: resolvedJurisdiction.unidade,
                rede: resolvedJurisdiction.rede,
                headerLabel: resolvedJurisdiction.headerLabel,
                lat: lat,
                lon: lon
            };
            // Hook público para troca de área de batalhão via GPS (pronto para acoplar áudios de voz futuramente)
            if (typeof window.onBattalionAreaChange !== 'function') {
                window.onBattalionAreaChange = function(novoBatalhao, anterior, novaRede) {
                    const shortR = typeof formatShortRedeName === 'function' ? formatShortRedeName(novaRede) : (novaRede || novoBatalhao);
                    const msg = 'Mudança de área: ' + novoBatalhao + ' (' + shortR + ') — Modular rádio HT';
                    if (typeof showToast === 'function') {
                        showToast(msg, 4200);
                    }
                    try {
                        window.dispatchEvent(new CustomEvent('azimute:battalion-change', {
                            detail: { novoBatalhao, anterior, novaRede: shortR, timestamp: Date.now() }
                        }));
                    } catch (_) {}
                };
            }
            if (closestArea.confirmed && closestArea.battalion) {
                if (window._azLastConfirmedBattalion && window._azLastConfirmedBattalion !== closestArea.battalion) {
                    window.onBattalionAreaChange(closestArea.battalion, window._azLastConfirmedBattalion, closestArea.rede);
                }
                window._azLastConfirmedBattalion = closestArea.battalion;
            }

            const nowDt = new Date();
            const dtCompact = nowDt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + nowDt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const rChanEl = document.getElementById('hudRadioChannel');
            const rAreaEl = document.getElementById('hudUnitArea');
            const rCiaBpmBadge = document.getElementById('hudLocationCiaBpmBadge');
            const hudUnitLineEl = document.getElementById('azHudUnitNetLine');
            const hudStreetLineEl = document.getElementById('azHudStreetLine');
            if (rChanEl) rChanEl.textContent = closestArea.rede;
            if (rAreaEl) rAreaEl.textContent = closestArea.unidade;
            if (hudUnitLineEl) hudUnitLineEl.textContent = formatShortRedeName(closestArea.rede) + ' • ' + dtCompact;
            if (hudStreetLineEl && azimuteLastStreet) {
                hudStreetLineEl.textContent = azimuteLastStreet + (azimuteCurrentSuburb ? ' • ' + azimuteCurrentSuburb : '');
            }
            if (rCiaBpmBadge) {
                rCiaBpmBadge.textContent = closestArea.headerLabel;
            }

            // Atualiza também os 2 Quadros de Resumo no Topo da Tela Inicial
            const homeRadio = document.getElementById('homeQuickRadio');
            const homeArea = document.getElementById('homeQuickArea');
            const homeHospName = document.getElementById('homeQuickHospName');
            const homeHospDist = document.getElementById('homeHospDistBadge');
            const homeHospEta = document.getElementById('homeQuickHospEta');
            const homeHospBtn = document.getElementById('homeBtnHospRoute');

            azimuteCurrentClosestArea = closestArea;
            if (homeRadio) homeRadio.textContent = closestArea.rede;
            if (homeArea) homeArea.textContent = closestArea.unidade;
            if (homeHospName) homeHospName.textContent = closestHosp.nome;
            if (homeHospDist) homeHospDist.textContent = 'Distância: ~' + driveEst.roadKm + 'km';
            if (homeHospEta) homeHospEta.textContent = 'Distância linear: ' + minHospDist.toFixed(1) + 'km • Tempo estimado: ~' + driveEst.mins + 'min';
            if (homeHospBtn) homeHospBtn.href = hospUrl;

            // Atualiza Barra de Status no Topo (ROTA HOSP e REDE resumida)
            const sbHospBtn = document.getElementById('statusBarBtnHosp');
            const sbRedeTxt = document.getElementById('statusBarRedeText');
            if (sbHospBtn) sbHospBtn.href = 'https://www.google.com/maps/dir/?api=1&destination=-19.9242,-43.9317&travelmode=driving';
            if (sbRedeTxt) sbRedeTxt.textContent = formatShortRedeName(closestArea.rede);

            // Atualiza Painel de 3 Colunas do Modo GRID
            const gRede = document.getElementById('gridTelemetryRede');
            const gArea = document.getElementById('gridTelemetryArea');
            const gAcc = document.getElementById('gridTelemetryAcc');
            const gHospBtn = document.getElementById('gridBtnHospRoute');
            const gMapBtn = document.getElementById('gridBtnExactMap');
            const gCoords = document.getElementById('gridCenterCoords');
            if (gRede) gRede.textContent = formatShortRedeName(closestArea.rede);
            if (gArea) gArea.textContent = closestArea.unidade;
            if (gAcc && acc) gAcc.textContent = '±' + Math.round(acc) + 'm';
            if (gHospBtn) gHospBtn.href = hospUrl;
            if (gMapBtn) gMapBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon;
            if (gCoords) gCoords.textContent = lat.toFixed(5) + ', ' + lon.toFixed(5);

            // Atualiza também a aba Saúde / APH (Painel de Monitoramento Hospitalar Inteligente)
            updateSaudeSmartHospitalComparison(lat, lon, closestArea);

            // 4. Lógica de Proximidade (BSC vs. Unidade Policial) com Regra de Horário (14:00 às 23:00):
            // - Das 14:00 às 23:00: considera Unidades Policiais e BSCs; se o mais próximo for uma BSC, exibe como "Base / BSC".
            // - Das 23:01 às 13:59: IGNORA todas as BSCs e busca/exibe obrigatoriamente a Unidade Policial mais próxima (Batalhão ou Companhia).
            const bscOpenNow = isAzimuteBscActiveNow(new Date());
            const eligibleSupportList = AZIMUTE_UNIDADES_POLICIAIS.filter(item => {
                if (item.tipo === 'bsc') return bscOpenNow;
                return true;
            });

            const rankedSupport = eligibleSupportList.map(u => {
                const d = azimuteCalcDistKm(lat, lon, u.lat, u.lon);
                return { ...u, linearKm: d, drive: calcEstimatedDriveMinutes(d) };
            }).sort((a, b) => a.linearKm - b.linearKm);

            // Também calcula a Unidade Policial (Batalhão/Cia) mais próxima caso o 1º colocado entre 14h-23h seja uma BSC
            const rankedOnlyUnits = AZIMUTE_UNIDADES_POLICIAIS
                .filter(u => u.tipo === 'unidade')
                .map(u => {
                    const d = azimuteCalcDistKm(lat, lon, u.lat, u.lon);
                    return { ...u, linearKm: d, drive: calcEstimatedDriveMinutes(d) };
                })
                .sort((a, b) => a.linearKm - b.linearKm);

            const closestPolice = rankedSupport[0] || rankedOnlyUnits[0];
            const secondClosestItem = (closestPolice && closestPolice.tipo === 'bsc')
                ? rankedOnlyUnits[0]
                : (rankedOnlyUnits[1] || rankedSupport[1] || null);

            const isClosestBsc = closestPolice && closestPolice.tipo === 'bsc';
            const policeDrive = closestPolice.drive;
            const policeUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + closestPolice.lat + ',' + closestPolice.lon + '&travelmode=driving';

            // Atualiza Caixa "Apoio Mais Próximo (GPS)" no Modo App / Home (Sem textos informativos de horário de BSC)
            const hpTypeLbl = document.getElementById('homeClosestPoliceTypeLabel');
            const hpName = document.getElementById('homeClosestPoliceName');
            const hpAddr = document.getElementById('homeClosestPoliceAddr');
            const hpDist = document.getElementById('homeClosestPoliceDist');
            const hpBtn = document.getElementById('homeClosestPoliceRouteBtn');

            if (hpTypeLbl) {
                hpTypeLbl.textContent = isClosestBsc ? 'Base / BSC Mais Próxima' : 'Unidade Policial Mais Próxima';
                hpTypeLbl.className = isClosestBsc
                    ? 'text-[10px] font-extrabold uppercase text-amber-300'
                    : 'text-[10px] font-bold uppercase text-pmmg-khaki';
            }
            if (hpName) hpName.textContent = closestPolice.nome;
            if (hpAddr) hpAddr.textContent = closestPolice.endereco;
            if (hpDist) hpDist.textContent = '~' + policeDrive.roadKm + 'km • ~' + policeDrive.mins + 'min';
            if (hpBtn) hpBtn.href = policeUrl;

            // Atualiza Hospital Mais Próximo REAL (fisicamente mais próximo via GPS contínuo) no card da Tela Inicial
            const physicalClosestHosp = hospEval.closest || closestHosp;
            const physicalDriveEst = { roadKm: physicalClosestHosp.roadKmStr, mins: physicalClosestHosp.mins };
            const physicalHospUrl = physicalClosestHosp.routeUrl;
            const hhName = document.getElementById('homeClosestHospitalCardName');
            const hhAddr = document.getElementById('homeClosestHospitalCardAddr');
            const hhDist = document.getElementById('homeClosestHospitalCardDist');
            const hhBtn = document.getElementById('homeClosestHospitalCardRouteBtn');
            if (hhName) hhName.textContent = physicalClosestHosp.nome;
            if (hhAddr) hhAddr.textContent = physicalClosestHosp.endereco || 'Unidade Hospitalar Mais Próxima';
            if (hhDist) hhDist.textContent = '~' + physicalDriveEst.roadKm + 'km • ~' + physicalDriveEst.mins + 'min';
            if (hhBtn) hhBtn.href = physicalHospUrl;

            // Atualiza Pontos Personalizados Salvos pelo Militar com distância GPS em tempo real
            if (typeof renderHomeNearestSupportCustomPlaces === 'function') {
                renderHomeNearestSupportCustomPlaces(lat, lon);
            }

            // Atualiza RASTREAMENTO contínuo de comércios/serviços conforme deslocamento do GPS
            if (typeof updateAzimuteGpsRastreamento === 'function') {
                updateAzimuteGpsRastreamento(lat, lon, false);
            }

            // Atualiza Card de Destaque Máximo "Unidades Próximas" no Modo GRID
            const gClosestUnit = document.getElementById('gridCenterClosestUnit');
            const gClosestAddr = document.getElementById('gridCenterClosestUnitAddr');
            const gTypeBadge = document.getElementById('gridClosestUnitTypeBadge');
            const gDistBadge = document.getElementById('gridClosestUnitDistBadge');
            const gRouteBtn = document.getElementById('gridClosestUnitRouteBtn');
            const gSecondHint = document.getElementById('gridSecondClosestUnitHint');
            const gBscStatus = document.getElementById('gridBscScheduleStatusBadge');

            if (gClosestUnit) gClosestUnit.textContent = closestPolice.nome;
            if (gClosestAddr) gClosestAddr.textContent = closestPolice.endereco;
            if (gTypeBadge) {
                gTypeBadge.textContent = isClosestBsc ? 'BASE / BSC (14H ÀS 23H)' : 'UNIDADE POLICIAL';
                gTypeBadge.className = 'px-2 py-0.5 rounded bg-[#161616] text-pmmg-khaki border border-[#C5A869]/60 font-mono font-extrabold text-[9px] uppercase';
            }
            if (gDistBadge) gDistBadge.textContent = '~' + policeDrive.roadKm + 'km • ~' + policeDrive.mins + 'min';
            if (gRouteBtn) gRouteBtn.href = policeUrl;
            if (gSecondHint && secondClosestItem) {
                const secLabel = isClosestBsc ? 'Unidade Policial Próx.: ' : '2ª Unidade Policial: ';
                gSecondHint.textContent = secLabel + secondClosestItem.nome + ' (~' + secondClosestItem.drive.roadKm + 'km)';
            }
            if (gBscStatus) {
                gBscStatus.textContent = bscOpenNow ? 'BSC Ativa (14:00-23:00)' : 'BSC Ignorada (23:01-13:59)';
                gBscStatus.className = 'font-mono text-[9.5px] text-pmmg-khaki font-bold shrink-0';
            }

            // b) Ponto de Abastecimento mais próximo
            let closestFuel = AZIMUTE_PONTOS_ABASTECIMENTO[0];
            let minFuelDist = 99999;
            AZIMUTE_PONTOS_ABASTECIMENTO.forEach(f => {
                const d = azimuteCalcDistKm(lat, lon, f.lat, f.lon);
                if (d < minFuelDist) { minFuelDist = d; closestFuel = f; }
            });
            const fuelDrive = calcEstimatedDriveMinutes(minFuelDist);
            const fuelUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + closestFuel.lat + ',' + closestFuel.lon + '&travelmode=driving';
            const hfName = document.getElementById('homeClosestFuelName');
            const hfAddr = document.getElementById('homeClosestFuelAddr');
            const hfDist = document.getElementById('homeClosestFuelDist');
            const hfBtn = document.getElementById('homeClosestFuelRouteBtn');
            if (hfName) hfName.textContent = closestFuel.nome;
            if (hfAddr) hfAddr.textContent = closestFuel.endereco;
            if (hfDist) hfDist.textContent = '~' + fuelDrive.roadKm + 'km';
            if (hfBtn) hfBtn.href = fuelUrl;

            const gSuppHospName = document.getElementById('gridSupportHospName');
            const gSuppFuelName = document.getElementById('gridSupportFuelName');
            const gSuppFuelDist = document.getElementById('gridSupportFuelDist');
            const gSuppFuelRoute = document.getElementById('gridSupportFuelRouteBtn');
            if (gSuppHospName) gSuppHospName.textContent = closestHosp.nome + ' (~' + driveEst.roadKm + 'km)';
            if (gSuppFuelName) gSuppFuelName.textContent = closestFuel.nome;
            if (gSuppFuelDist) gSuppFuelDist.textContent = '~' + fuelDrive.roadKm + 'km • ~' + fuelDrive.mins + 'min';
            if (gSuppFuelRoute) gSuppFuelRoute.href = fuelUrl;

            // 3. Atualiza Tela Socorro (Modo Prioridade) com Distância e Tempo Médio de Deslocamento
            const sosRadio = document.getElementById('sosBigRadio');
            const sosCoords = document.getElementById('sosBigCoords');
            const sosHosp = document.getElementById('sosBigHospital');
            const sosDist = document.getElementById('sosBigDistance');
            const sosEta = document.getElementById('sosBigEta');
            const sosRoute = document.getElementById('sosBtnHospitalRoute');

            if (sosRadio) sosRadio.textContent = closestArea.rede;
            if (sosCoords) sosCoords.textContent = closestArea.unidade + ' • GPS: ' + lat.toFixed(6) + ', ' + lon.toFixed(6) + ' (±' + acc + 'm)';
            if (sosHosp) sosHosp.textContent = closestHosp.nome;
            if (sosDist) sosDist.textContent = '~' + driveEst.roadKm + 'km (' + minHospDist.toFixed(1) + 'km linear)';
            if (sosEta) sosEta.textContent = '~' + driveEst.mins + 'min (em prioridade)';
            if (sosRoute) sosRoute.href = hospUrl;
        }

        // Inicia o watchPosition contínuo automaticamente sem exigir cliques em "Reconectar"
        function startAzimuteLiveGps() {
            loadLastValidQthFromCache();
            if (!navigator.geolocation) {
                setGpsOnlineState(false, 'GPS Indisponível');
                return;
            }
            if (azimuteWatchId !== null) {
                navigator.geolocation.clearWatch(azimuteWatchId);
            }
            azimuteWatchId = navigator.geolocation.watchPosition(onAzimuteGpsSuccess, onAzimuteGpsError, {
                enableHighAccuracy: true,
                maximumAge: 2000,
                timeout: 20000
            });
        }

        async function onAzimuteGpsSuccess(pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const acc = Math.round(pos.coords.accuracy || 10);
            const alt = pos.coords.altitude !== null && pos.coords.altitude !== undefined ? Math.round(pos.coords.altitude) : null;

            setGpsOnlineState(navigator.onLine, navigator.onLine ? 'GPS' : 'GPS Offline (Satélite Ativo)', acc);
            const accEl = document.getElementById('hudGpsAccuracy');
            if (accEl) accEl.textContent = 'Precisão: ±' + acc + 'm';

            const coordsEl = document.getElementById('detailExactCoords');
            if (coordsEl) coordsEl.textContent = lat.toFixed(6) + ', ' + lon.toFixed(6);

            const mapsBtn = document.getElementById('btnOpenCurrentInMaps');
            if (mapsBtn) mapsBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon;
            const homePillLoc = document.getElementById('btnHomePillExactLoc');
            if (homePillLoc) homePillLoc.href = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon;

            if (alt !== null) {
                const altEl = document.getElementById('detAltitude');
                const altQuick = document.getElementById('hudAltitudeQuickBadge');
                if (altEl) altEl.textContent = alt + 'm';
                if (altQuick) altQuick.textContent = 'Altitude: ' + alt + 'm';
                try { localStorage.setItem('azimute_last_altitude', alt + 'm'); } catch (e) {}
            }

            updateOfflineProximityData(lat, lon, acc);

            // Geocodificação reversa automática + detecção de esquina/cruzamento (ex: "Rua Platina / Rua José Viola")
            const now = Date.now();
            let movedMeters = 999;
            if (azimuteLastGeoLat !== null && azimuteLastGeoLon !== null) {
                movedMeters = azimuteCalcDistKm(lat, lon, azimuteLastGeoLat, azimuteLastGeoLon) * 1000;
            }

            if (movedMeters >= 12 || (now - azimuteLastLookupTime) >12000) {
                azimuteLastGeoLat = lat;
                azimuteLastGeoLon = lon;
                azimuteLastLookupTime = now;

                if (navigator.onLine !== false) {
                    try {
                        const res = await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lon + '&zoom=18&addressdetails=1&extratags=1&accept-language=pt-BR');
                        const data = await res.json();
                        if (data && data.address) {
                            const road = data.address.road || data.address.pedestrian || data.address.footway || data.address.path || data.name || 'Via / Logradouro local';
                            const houseNum = data.address.house_number ? ', nº aprox. ' + data.address.house_number : '';
                            const suburb = data.address.suburb || data.address.neighbourhood || data.address.quarter || data.address.city_district || '';
                            const city = data.address.city || data.address.town || data.address.municipality || 'RMBH';
                            const stateCode = data.address['ISO3166-2-lvl4'] ? data.address['ISO3166-2-lvl4'].split('-').pop() : 'MG';
                            const postcode = await resolveExactStreetCep(road, suburb, city, stateCode, data);

                            // Verifica se há esquina / cruzamento próximo (raio de ~35m via Overpass OSM)
                            let cornerRoad = null;
                            try {
                                const ovCtrl = new AbortController();
                                const ovTimer = setTimeout(() =>ovCtrl.abort(), 3200);
                                const ovQuery = '[out:json][timeout:3];way(around:35,' + lat + ',' + lon + ')["highway"]["name"];out tags;';
                                const ovRes = await fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(ovQuery), { signal: ovCtrl.signal });
                                clearTimeout(ovTimer);
                                if (ovRes.ok) {
                                    const ovData = await ovRes.json();
                                    if (ovData && Array.isArray(ovData.elements)) {
                                        const normPrimary = road.trim().toLowerCase();
                                        for (const el of ovData.elements) {
                                            const candidate = el.tags && el.tags.name ? el.tags.name.trim() : '';
                                            if (candidate && candidate.toLowerCase() !== normPrimary) {
                                                cornerRoad = candidate;
                                                break;
                                            }
                                        }
                                    }
                                }
                            } catch (eCorner) {}

                            if (cornerRoad) {
                                azimuteLastStreet = road + ' / ' + cornerRoad;
                            } else {
                                azimuteLastStreet = road + (houseNum || '');
                            }

                            const subText = [suburb, city].filter(Boolean).join(' • ') + postcode;
                            const timeStr = new Date().toLocaleString('pt-BR');

                            document.getElementById('hudCurrentStreet').textContent = azimuteLastStreet;
                            document.getElementById('hudCurrentSuburb').textContent = subText;
                            const hQth = document.getElementById('homeQuickQth');
                            const hSub = document.getElementById('homeQuickSuburb');
                            const sbQth = document.getElementById('statusBarQth');
                            if (hQth) hQth.textContent = azimuteLastStreet;
                            if (hSub) hSub.textContent = subText;
                            if (sbQth) sbQth.textContent = formatFullStatusBarQth(azimuteLastStreet, subText);
                            const gQth = document.getElementById('gridCenterQth');
                            const gSub = document.getElementById('gridCenterSuburb');
                            if (gQth) gQth.textContent = azimuteLastStreet;
                            if (gSub) gSub.textContent = subText;
                            document.getElementById('hudLastSavedTimestamp').textContent = 'Último QTH registrado: ' + timeStr;
                            document.getElementById('sosBigStreet').textContent = azimuteLastStreet;
                            document.getElementById('sosBigSuburb').textContent = subText;

                            azimuteCurrentSuburb = suburb;
                            azimuteCurrentCity = city;
                            updateOfflineProximityData(lat, lon, acc);

                            const rCiaBpmBadge = document.getElementById('hudLocationCiaBpmBadge');
                            if (rCiaBpmBadge && typeof formatCiaBatalhaoHeaderLabel === 'function') {
                                rCiaBpmBadge.textContent = formatCiaBatalhaoHeaderLabel(azimuteCurrentClosestArea, subText, azimuteLastStreet);
                            }

                            saveLastValidQthToCache({
                                street: azimuteLastStreet,
                                suburb: subText,
                                suburbRaw: suburb,
                                cityRaw: city,
                                cepVerified: Boolean(postcode),
                                lat: lat,
                                lon: lon,
                                acc: acc,
                                alt: document.getElementById('detAltitude') ? document.getElementById('detAltitude').textContent : null,
                                timestamp: timeStr
                            });
                        }
                    } catch (err) {
                        setGpsOnlineState(false, 'GPS Offline (Último QTH Salvo)');
                    }
                } else {
                    setGpsOnlineState(false, 'GPS Offline (Último QTH Salvo)');
                }
            }

            // Clima agora apenas sob demanda (sem chamadas automáticas no GPS para máxima fluidez do mapa)
        }

        function onAzimuteGpsError(err) {
            setGpsOnlineState(false, 'GPS Offline (Cache Local)');
            loadLastValidQthFromCache();
            setTimeout(() => {
                if (navigator.geolocation) {
                    startAzimuteLiveGps();
                }
            }, 6000);
        }

        window.addEventListener('online', () => {
            setGpsOnlineState(true, 'GPS');
            azimuteLastLookupTime = 0;
            startAzimuteLiveGps();
        });

        window.addEventListener('offline', () => {
            setGpsOnlineState(false, 'GPS Offline (Cache Local)');
            loadLastValidQthFromCache();
        });


        function formatCiaBatalhaoHeaderLabel(closestArea, suburbStr = '', streetStr = '') {
            const parts = String(suburbStr || '').replace(/\s*•\s*CEP:.*$/i, '').split('•').map(s => s.trim()).filter(Boolean);
            const subOnly = parts[0] || azimuteCurrentSuburb || '';
            const cityOnly = parts[1] || azimuteCurrentCity || '';
            const resolved = resolveTerritorialJurisdiction(subOnly, cityOnly);
            if (resolved && resolved.confirmed) {
                return resolved.headerLabel;
            }
            if (closestArea && closestArea.confirmed && closestArea.headerLabel) {
                return closestArea.headerLabel;
            }
            return resolved ? resolved.headerLabel : 'Batalhão não consta na base';
        }


        window.openCurrentNetworkBattalionModal = function() {
            const modal = document.getElementById('networkBattalionModal');
            const titleEl = document.getElementById('netModalTitle');
            const bodyEl = document.getElementById('netModalBody');
            if (!modal || !titleEl || !bodyEl) return;

            const areaObj = azimuteCurrentClosestArea;
            if (!areaObj || areaObj.confirmed === false) {
                titleEl.textContent = 'Jurisdição não confirmada';
                bodyEl.innerHTML = `
                    <div class="bg-pmmg-dark p-3.5 rounded-xl border border-pmmg-border space-y-1.5">
                        <strong class="text-pmmg-khaki text-sm block">Batalhão não confirmado na base</strong>
                        <p class="text-xs text-gray-300"><strong>Local / Bairro atual:</strong> ${azimuteCurrentSuburb || 'Aguardando confirmação pelo GPS'}</p>
                        <p class="text-xs text-gray-400">O bairro ou coordenada atual ainda não consta com certeza na base territorial carregada. Consulte a aba Unidades para selecionar manualmente.</p>
                    </div>
                `;
                modal.classList.remove('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }
            const unitLabel = areaObj.unidade || '';
            const shortRede = formatShortRedeName(areaObj.rede);
            const bpmMatch = unitLabel.match(/^(\d+º\s*BPM|BPTran)/i);
            const bpmName = areaObj.battalion || (bpmMatch ? bpmMatch[1] : '');

            titleEl.textContent = bpmName + ' • REDE: ' + shortRede;

            let unitData = null;
            if (typeof AZIMUTE_DB !== 'undefined' && AZIMUTE_DB) {
                const allUnits = [...(AZIMUTE_DB.rpm1 || []), ...(AZIMUTE_DB.rpm2 || [])];
                unitData = allUnits.find(u =>u.nome.toLowerCase() === bpmName.toLowerCase());
            }

            if (unitData && unitData.companhias && unitData.companhias.length >0) {
                bodyEl.innerHTML = `
                    <div class="bg-pmmg-dark p-3 rounded-xl border border-pmmg-border space-y-1">
                        <div class="flex flex-wrap justify-between gap-2">
                            <strong class="text-pmmg-khaki text-sm">${unitData.nome} — ${unitData.cidade}</strong>
                            <span class="font-mono text-xs text-pmmg-gold font-bold">SOU: ${unitData.telefone_sou || '(31) 2191-6110'}</span>
                        </div>
                        <p class="text-[11px] text-gray-300"><strong>Sede:</strong> ${unitData.endereco_sede || ''}</p>
                        <p class="text-[11px] text-gray-400"><strong>Área Atual Detectada:</strong> ${unitLabel}</p>
                    </div>
                    <div class="space-y-2.5">
                        <h4 class="text-xs font-extrabold uppercase text-pmmg-khaki tracking-wider">Companhias, Bairros e Vias (${unitData.nome}):</h4>
                        ${unitData.companhias.map(c => `
                            <div class="bg-pmmg-dark p-3 rounded-xl border border-pmmg-border space-y-1.5">
                                <div class="flex justify-between items-center border-b border-pmmg-border pb-1">
                                    <strong class="text-white font-bold text-xs">${c.nome} • ${c.setor || ''}</strong>
                                    <span class="font-mono text-[11px] text-pmmg-khaki">${c.telefone || ''}</span>
                                </div>
                                <p class="text-[11px] text-gray-300"><strong>Sede:</strong> ${c.endereco || ''}</p>
                                <p class="text-[11px] text-gray-300"><strong>Bairros:</strong> ${(c.bairros || []).join(', ')}</p>
                                <p class="text-[11px] text-gray-400"><strong>Principais Vias:</strong> ${(c.vias || []).join(', ')}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                bodyEl.innerHTML = `
                    <div class="bg-pmmg-dark p-3.5 rounded-xl border border-pmmg-border space-y-1.5">
                        <div class="flex flex-wrap justify-between gap-2">
                            <strong class="text-pmmg-khaki text-sm">${unitData ? unitData.nome + ' — ' + unitData.cidade : bpmName}</strong>
                            <span class="font-mono text-xs text-pmmg-gold font-bold">SOU: ${unitData && unitData.telefone_sou ? unitData.telefone_sou : 'Consulte a gaveta da unidade'}</span>
                        </div>
                        <p class="text-xs text-gray-300"><strong>Área Detectada pelo GPS:</strong> ${unitLabel}</p>
                        <p class="text-xs text-gray-300"><strong>Sede:</strong> ${unitData && unitData.endereco_sede ? unitData.endereco_sede : 'Região Metropolitana de BH'}</p>
                        <p class="text-xs text-gray-400"><strong>Divisas:</strong> ${unitData && unitData.divisas ? unitData.divisas : 'Consulte o painel da unidade para detalhes territoriais.'}</p>
                    </div>
                `;
            }

            modal.classList.remove('hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.closeCurrentNetworkBattalionModal = function() {
            const modal = document.getElementById('networkBattalionModal');
            if (modal) modal.classList.add('hidden');
        };

        window.openNetworkUnitFullPanel = function() {
            const areaObj = azimuteCurrentClosestArea;
            closeCurrentNetworkBattalionModal();
            if (!areaObj || areaObj.confirmed === false) {
                if (typeof showView === 'function') showView('unidades');
                return;
            }
            const unitLabel = areaObj.unidade || '';
            const bpmMatch = unitLabel.match(/^(\d+º\s*BPM|BPTran)/i);
            const bpmName = areaObj.battalion || (bpmMatch ? bpmMatch[1] : '');
            if (bpmName.toUpperCase() === '18º BPM') {
                showView('18bpm');
            } else if (bpmName && typeof window.openBattalionPlaceholder === 'function') {
                window.openBattalionPlaceholder(bpmName, 'RMBH', 'Sede ' + bpmName);
            } else if (typeof showView === 'function') {
                showView('unidades');
            }
        };

        window.downloadCurrentNetworkOfflineData = function() {
            const areaObj = azimuteCurrentClosestArea;
            if (!areaObj || areaObj.confirmed === false) return;
            const unitLabel = areaObj.unidade || '';
            const shortRede = formatShortRedeName(areaObj.rede);
            const bpmMatch = unitLabel.match(/^(\d+º\s*BPM|BPTran)/i);
            const bpmName = areaObj.battalion || (bpmMatch ? bpmMatch[1] : '');
            const bodyEl = document.getElementById('netModalBody');
            const contentHtml = bodyEl ? bodyEl.innerHTML : '';

            const offlineDoc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport"content="width=device-width, initial-scale=1.0">
<title>AZIMUTE Offline - ${bpmName} (${shortRede})</title>
<style>
  body { background:#0F0F0F; color:#e5e7eb; font-family:sans-serif; padding:20px; max-width:800px; margin:0 auto; }
  h1 { color:#C2B280; border-bottom:1px solid #3d3a33; padding-bottom:8px; }
  div { margin-bottom:10px; }
  strong { color:#D4AF37; }
</style>
</head>
<body>
  <h1>AZIMUTE PMMG • Dados Offline: ${bpmName} (REDE: ${shortRede})</h1>
  <p>Gerado para consulta offline em: ${new Date().toLocaleString('pt-BR')}</p>
  ${contentHtml}

<\/body>
</html>`;

            const blob = new Blob([offlineDoc], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AZIMUTE-Offline-${bpmName.replace(/\s+/g, '')}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() =>URL.revokeObjectURL(url), 1500);
            if (typeof showToast === 'function') showToast('Dados do ' + bpmName + 'baixados para consulta offline!');
        };


        function switch18Tab(subId) {
            document.querySelectorAll('.sub18-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.nav-18-tab').forEach(el => {
                el.className = 'nav-18-tab px-3.5 py-2 rounded-lg bg-pmmg-dark text-gray-400 border border-pmmg-border hover:text-gray-200 font-medium flex items-center gap-1.5';
            });

            const targetSub = document.getElementById(`sub18-${subId}`);
            if (targetSub) targetSub.classList.remove('hidden');

            const activeTab = document.getElementById(`tab-18-${subId}`);
            if (activeTab) {
                activeTab.className = 'nav-18-tab px-3.5 py-2 rounded-lg bg-pmmg-card text-pmmg-khaki border border-pmmg-gold font-extrabold flex items-center gap-1.5';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function openBattalionPlaceholder(name, region, address) {
            document.getElementById('skeletonTitle').textContent = name;
            document.getElementById('skeletonSubtitle').textContent = `${region} • Sede: ${address}`;
            document.getElementById('skeletonDesc').textContent = `Unidade pertencente à PMMG (${region}). Utilizará o esqueleto padrão com as teclas navegáveis primárias do 18º BPM.`;
            showView('skeleton');
            const activeBadge = document.getElementById('activeUnitBadge');
            const activeName = document.getElementById('activeUnitName');
            if (activeBadge) activeBadge.classList.remove('hidden');
            if (activeName) activeName.textContent = name;
        }


        function filter18BpmContent() {
            const query = document.getElementById('internalSearch18').value.toLowerCase().trim();
            const clearBtn = document.getElementById('clear18SearchBtn');
            const stats = document.getElementById('internal18Stats');
            const statsText = document.getElementById('internal18StatsText');

            if (query.length >0) {
                clearBtn.classList.remove('hidden');
                document.querySelectorAll('.sub18-content').forEach(el =>el.classList.remove('hidden'));

                const cards = document.querySelectorAll('#view-18bpm .bg-pmmg-card');
                let count = 0;

                cards.forEach(card => {
                    let text = card.dataset.azSearchText;
                    if (!text) {
                        text = (card.textContent || '').toLowerCase();
                        card.dataset.azSearchText = text;
                    }
                    if (text.includes(query)) {
                        card.classList.remove('hidden');
                        count++;
                    } else {
                        card.classList.add('hidden');
                    }
                });

                stats.classList.remove('hidden');
                statsText.textContent = `${count} item(ns) encontrado(s)`;
            } else {
                clear18Search();
            }
        }

        window.toggleCiaMoreBairros = function(ciaId) {
            const box = document.getElementById('moreBairros-' + ciaId);
            const btn = document.getElementById('btnMoreBairros-' + ciaId);
            if (!box) return;
            const isHidden = box.classList.contains('hidden');
            if (isHidden) {
                box.classList.remove('hidden');
                box.classList.add('flex');
                if (btn) btn.textContent = 'Ver menos';
            } else {
                box.classList.add('hidden');
                box.classList.remove('flex');
                const totalExtra = box.querySelectorAll('a, span').length;
                if (btn) btn.textContent = totalExtra > 0 ? `Ver mais (${totalExtra})` : 'Ver mais';
            }
        };

        window.toggleUnitsSearchBox = function(wrapperId, inputId) {
            const wrap = document.getElementById(wrapperId);
            const inp = document.getElementById(inputId);
            if (!wrap) return;
            const willOpen = wrap.classList.contains('hidden');
            if (willOpen) {
                wrap.classList.remove('hidden');
                wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                if (inp) setTimeout(() => inp.focus(), 80);
            } else {
                wrap.classList.add('hidden');
            }
        };

        window.syncUnitsSearchWithGlobal = function(val, localDropId) {
            const gInp = document.getElementById('globalSearch');
            const gDrop = document.getElementById('globalSearchDropdown');
            const localDrop = document.getElementById(localDropId);
            if (!gInp || !localDrop) return;
            const q = (val || '').trim();
            if (q.length < 2) {
                localDrop.classList.add('hidden');
                localDrop.innerHTML = '';
                return;
            }
            gInp.value = q;
            handleGlobalSearch();
            if (gDrop && !gDrop.classList.contains('hidden')) {
                localDrop.innerHTML = gDrop.innerHTML;
                localDrop.classList.remove('hidden');
                gDrop.classList.add('hidden');
                azimuteRefreshIcons(localDrop);
            } else {
                localDrop.classList.add('hidden');
            }
        };

        window.clearUnitsLocalSearch = function(inputId, localDropId) {
            const inp = document.getElementById(inputId);
            const drop = document.getElementById(localDropId);
            if (inp) {
                inp.value = '';
                inp.focus();
            }
            if (drop) {
                drop.classList.add('hidden');
                drop.innerHTML = '';
            }
        };

        function clear18Search() {
            document.getElementById('internalSearch18').value = '';
            document.getElementById('clear18SearchBtn').classList.add('hidden');
            document.getElementById('internal18Stats').classList.add('hidden');
            document.querySelectorAll('#view-18bpm .bg-pmmg-card').forEach(card =>card.classList.remove('hidden'));
            switch18Tab('cias');
        }


        let AZIMUTE_DB = null;
        let currentDrawerUnit = null;
        let lockScreenNotifyEnabled = false;



        window.azRefreshMapCacheStats = function() {
            const cEl = document.getElementById('azMapCacheCountTxt');
            const sEl = document.getElementById('azMapCacheSizeTxt');
            const tEl = document.getElementById('azMapCacheStatusTxt');
            if (!cEl || !sEl) return;
            azSwRequest({ type: 'GET_MAP_CACHE_STATS' }).then(res => {
                if (res && res.ok && res.stats) {
                    cEl.textContent = res.stats.count + ' / ' + res.stats.max;
                    sEl.textContent = res.stats.mb + ' MB';
                    if (tEl) tEl.textContent = 'Os mapas visualizados ficam salvos no aparelho e abrem sem baixar de novo (limite de ' + res.stats.max + ' blocos).';
                }
            }).catch(() => {
                cEl.textContent = '--';
                sEl.textContent = '--';
                if (tEl) tEl.textContent = 'Cache offline indisponível: o Service Worker só ativa quando o app é aberto por https (GitHub Pages) ou localhost.';
            });
        };

        window.azClearMapCache = function() {
            azSwRequest({ type: 'CLEAR_MAP_CACHE' }).then(res => {
                if (typeof showToast === 'function') showToast(res && res.ok ? 'Cache do mapa limpo.' : 'Falha ao limpar o cache do mapa.');
                window.azRefreshMapCacheStats();
            }).catch(() => {
                if (typeof showToast === 'function') showToast('Service Worker inativo: nada para limpar.');
            });
        };

        // Pré-carregamento gentil em segundo plano (OpenFreeMap + Satélite Esri CORS + CartoDB) e download manual de setor
        (function initOfflineSectorPrecacher() {
            let precacheCancelled = false;
            let precacheRunning = false;
            let mapInteracting = false;
            let idleResumeTimer = null;

            function setSectorUi(statusText, done, total, active) {
                const st = document.getElementById('azOfflineSectorStatus');
                const wrap = document.getElementById('azOfflineSectorProgressWrap');
                const fill = document.getElementById('azOfflineSectorFill');
                const txt = document.getElementById('azOfflineSectorProgTxt');
                const cancelBtn = document.getElementById('azOfflineSectorCancelBtn');
                const startBtn = document.getElementById('azOfflineSectorBtn');
                if (st && statusText) st.textContent = statusText;
                if (wrap) wrap.classList.toggle('hidden', !active && total === 0);
                if (cancelBtn) cancelBtn.classList.toggle('hidden', !active);
                if (startBtn) startBtn.disabled = Boolean(active);
                if (fill && total > 0) fill.style.width = Math.min(100, Math.round((done / total) * 100)) + '%';
                if (txt && total > 0) txt.textContent = done + ' / ' + total + ' blocos';
            }

            function latLngToTile(lat, lng, z) {
                const n = Math.pow(2, z);
                const x = Math.floor(((lng + 180) / 360) * n);
                const latRad = (lat * Math.PI) / 180;
                const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
                return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)) };
            }

            function buildSectorTileUrls(lat, lng, isManualHighDef) {
                const urls = [
                    'https://tiles.openfreemap.org/styles/liberty',
                    'https://tiles.openfreemap.org/styles/dark'
                ];
                const seen = new Set(urls);
                function addUrl(u) {
                    if (!seen.has(u)) { seen.add(u); urls.push(u); }
                }
                const cosLat = Math.max(0.25, Math.cos((lat * Math.PI) / 180));
                function addGrid(z, radiusKm, template) {
                    const dLat = radiusKm / 111.32;
                    const dLng = radiusKm / (111.32 * cosLat);
                    const tl = latLngToTile(lat + dLat, lng - dLng, z);
                    const br = latLngToTile(lat - dLat, lng + dLng, z);
                    for (let x = tl.x; x <= br.x; x++) {
                        for (let y = tl.y; y <= br.y; y++) {
                            addUrl(template.replace('{z}', z).replace('{x}', x).replace('{y}', y));
                            if (urls.length >= (isManualHighDef ? 360 : 170)) return;
                        }
                    }
                }
                // Camada Clara vetorial (z12-z14 cobrem a cidade inteira com nitidez até z19)
                [12, 13, 14].forEach(z => addGrid(z, isManualHighDef ? 4.5 : 3.2, 'https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'));
                // Camada Satélite CORS + rótulos
                const satZooms = isManualHighDef ? [13, 14, 15, 16, 17] : [13, 14, 15];
                satZooms.forEach(z => {
                    const rKm = z >= 16 ? 1.2 : (z === 15 ? 1.8 : 3.0);
                    addGrid(z, rKm, 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
                    if (z <= 16) addGrid(z, rKm, 'https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png');
                });
                return urls;
            }

            function bindPauseListeners() {
                const m = window.azGeoMap;
                if (!m || m._azPrecachePauseBound) return;
                m._azPrecachePauseBound = true;
                const onStart = () => {
                    mapInteracting = true;
                    if (idleResumeTimer) { clearTimeout(idleResumeTimer); idleResumeTimer = null; }
                };
                const onEnd = () => {
                    if (idleResumeTimer) clearTimeout(idleResumeTimer);
                    idleResumeTimer = setTimeout(() => { mapInteracting = false; }, 1200);
                };
                m.on('movestart', onStart);
                m.on('zoomstart', onStart);
                m.on('moveend', onEnd);
                m.on('zoomend', onEnd);
            }

            window.azCancelSectorDownload = function() {
                precacheCancelled = true;
                setSectorUi('Download cancelado.', 0, 0, false);
            };

            window.azStartSectorDownload = async function(isManual) {
                if (precacheRunning) return;
                if (!(navigator.serviceWorker && navigator.serviceWorker.controller)) {
                    if (isManual && typeof showToast === 'function') showToast('Pré-carga disponível apenas via https (PWA) ou localhost.');
                    setSectorUi('Requer publicação em https para pré-carregar.', 0, 0, false);
                    return;
                }
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (!isManual && conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
                    return;
                }
                let lat = typeof azimuteLastGeoLat === 'number' ? azimuteLastGeoLat : -19.9191;
                let lng = typeof azimuteLastGeoLon === 'number' ? azimuteLastGeoLon : -43.9386;
                if (window.azGeoMap && typeof window.azGeoMap.getCenter === 'function') {
                    const c = window.azGeoMap.getCenter();
                    if (c && typeof c.lat === 'number') { lat = c.lat; lng = c.lng; }
                }
                bindPauseListeners();
                const urls = buildSectorTileUrls(lat, lng, Boolean(isManual));
                precacheCancelled = false;
                precacheRunning = true;
                let done = 0;
                const total = urls.length;
                setSectorUi(isManual ? 'Baixando setor atual em alta definição...' : 'Pré-carregando área atual em segundo plano...', 0, total, true);

                try {
                    const CHUNK = 2;
                    for (let i = 0; i < urls.length; i += CHUNK) {
                        if (precacheCancelled) break;
                        while (mapInteracting && !precacheCancelled) {
                            await new Promise(r => setTimeout(r, 350));
                        }
                        if (precacheCancelled) break;
                        const slice = urls.slice(i, i + CHUNK);
                        await azSwRequest({ type: 'PRECACHE_MAP_URLS', urls: slice }).catch(() => null);
                        done += slice.length;
                        setSectorUi(isManual ? 'Salvando blocos no aparelho...' : 'Pré-carregando em segundo plano...', done, total, true);
                    }
                    if (!precacheCancelled) {
                        try { localStorage.setItem('az_map_precache_last_v1', JSON.stringify({ lat, lng, ts: Date.now() })); } catch (_) {}
                        setSectorUi('Setor pronto para uso offline (' + done + ' blocos verificados).', total, total, false);
                        if (typeof window.azRefreshMapCacheStats === 'function') window.azRefreshMapCacheStats();
                        if (isManual && typeof showToast === 'function') showToast('Setor salvo para uso offline!');
                    }
                } finally {
                    precacheRunning = false;
                }
            };

            window.azScheduleAutoSectorPrecache = function() {
                if (precacheRunning) return;
                if (!(navigator.serviceWorker && navigator.serviceWorker.controller)) return;
                try {
                    const last = JSON.parse(localStorage.getItem('az_map_precache_last_v1') || 'null');
                    const lat = typeof azimuteLastGeoLat === 'number' ? azimuteLastGeoLat : -19.9191;
                    const lng = typeof azimuteLastGeoLon === 'number' ? azimuteLastGeoLon : -43.9386;
                    if (last && typeof last.lat === 'number') {
                        const dLat = (lat - last.lat) * 111.32;
                        const dLng = (lng - last.lng) * 111.32 * Math.cos((lat * Math.PI) / 180);
                        if (Math.hypot(dLat, dLng) < 2.0) return;
                    }
                } catch (_) {}
                setTimeout(() => { window.azStartSectorDownload(false); }, 1800);
            };
        })();

        // Carrega e unifica todos os JSONs de Batalhões do repositório (1ª RPM, 2ª RPM, 1º BPM, 22º BPM, etc.)
        function normalizeBattalionRecord(raw, defaultCity) {
            if (!raw || typeof raw !== 'object') return null;
            const nome = (raw.nome || raw.unidade || raw.batalhao || '').trim();
            if (!nome) return null;

            const ciasRaw = Array.isArray(raw.companhias) ? raw.companhias : (Array.isArray(raw.cias) ? raw.cias : []);
            const companhias = ciasRaw.map(c => ({
                nome: c.nome || c.cia || 'Cia PM',
                setor: c.setor || c.nome || '',
                endereco: c.endereco || (typeof c.sede === 'string' ? c.sede : (c.sede && c.sede.endereco ? c.sede.endereco : '')),
                telefone: c.telefone || (Array.isArray(c.telefones) ? c.telefones.join(' / ') : (c.telefones || '')),
                bairros: Array.isArray(c.bairros) ? c.bairros : [],
                vias: Array.isArray(c.vias) ? c.vias : (Array.isArray(c.corredores) ? c.corredores : [])
            }));

            const saudeDelegacias = [];
            if (Array.isArray(raw.saude_delegacias)) saudeDelegacias.push(...raw.saude_delegacias);
            if (Array.isArray(raw.delegacias_apoio)) {
                raw.delegacias_apoio.forEach(d => saudeDelegacias.push({
                    tipo: 'Delegacia / Deplan',
                    nome: d.nome || d.unidade || 'Delegacia de Apoio',
                    endereco: d.endereco || '',
                    telefone: d.telefone || ''
                }));
            }
            if (Array.isArray(raw.hospitais)) {
                raw.hospitais.forEach(h => saudeDelegacias.push({
                    tipo: 'Saúde / Hospital',
                    nome: h.nome || 'Hospital / UPA',
                    endereco: h.endereco || '',
                    telefone: h.telefone || ''
                }));
            }

            const apoioAbastecimento = Array.isArray(raw.apoio_abastecimento) ? [...raw.apoio_abastecimento] : [];
            if (Array.isArray(raw.bscs)) {
                raw.bscs.forEach(b => apoioAbastecimento.push({
                    nome: b.nome || 'Base de Segurança Comunitária (BSC)',
                    endereco: b.endereco || '',
                    maps_url: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((b.endereco || b.nome || '') + ' MG')
                }));
            }
            if (Array.isArray(raw.bases_comunitarias)) {
                raw.bases_comunitarias.forEach(b => apoioAbastecimento.push({
                    nome: (b.cia ? b.cia + ' • ' : '') + 'Base Comunitária',
                    endereco: b.local || b.endereco || '',
                    maps_url: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((b.local || b.endereco || '') + ' MG')
                }));
            }

            const sedeAddr = raw.endereco_sede
                || (typeof raw.sede === 'string' ? raw.sede : (raw.sede && raw.sede.endereco ? raw.sede.endereco : ''))
                || raw.endereco
                || '';
            const sedeTel = raw.telefone_sou
                || raw.telefone
                || (raw.sede && Array.isArray(raw.sede.telefones) ? raw.sede.telefones.join(' / ') : '')
                || '';
            const rawRede = (raw.rede_radio || raw.rede || '').trim();
            const normRede = rawRede
                ? (/^REDE:/i.test(rawRede) ? rawRede : ('REDE: ' + rawRede.replace(/(\d+)\s*BPM/i, '$1º BPM')))
                : ('REDE: ' + nome);

            return {
                nome,
                cidade: raw.cidade || defaultCity || 'RMBH',
                regiao: raw.regiao || raw.rpm || defaultCity || 'RMBH',
                rede_radio: normRede,
                endereco_sede: sedeAddr,
                telefone_sou: sedeTel,
                isSummaryOnly: Boolean(raw.isSummaryOnly),
                status: raw.isSummaryOnly ? 'Área pronta para receber os dados' : ('Dados Carregados • ' + companhias.length + ' Cia(s)'),
                companhias,
                apoio_abastecimento: apoioAbastecimento,
                divisas: Array.isArray(raw.divisas) ? raw.divisas.join(' • ') : (raw.divisas || (Array.isArray(raw.limites) ? raw.limites.join(' • ') : '')),
                saude_delegacias: saudeDelegacias,
                contatos: Array.isArray(raw.contatos) ? raw.contatos : []
            };
        }

        // Base embutida no padrão completo do 18º BPM para os batalhões da 1ª e 2ª RPM (sobrescrita automaticamente se JSON externo tiver mais Cias)
        const AZIMUTE_EMBEDDED_BATTALIONS = [
            {
                nome: "22º BPM",
                cidade: "Belo Horizonte",
                regiao: "1ª RPM • Capital",
                rede_radio: "REDE: 1ª RPM / 22º BPM A",
                endereco_sede: "Avenida Arthur Bernardes, 1337 – Santa Lúcia, Belo Horizonte - MG",
                telefone_sou: "(31) 2123-1800 / (31) 3284-8445",
                companhias: [
                    { nome: "124ª Cia PM", setor: "Santa Lúcia / Belvedere / Papagaio", endereco: "Avenida Arthur Bernardes, 1337 – Santa Lúcia", telefone: "(31) 2123-1809", bairros: ["Morro do Papagaio", "Santa Lúcia", "Santo Antônio", "Belvedere", "Santa Rita de Cássia", "Vila Barragem Santa Lúcia", "Vila Estrela", "Cidade Jardim", "São Bento", "São Pedro"], vias: ["Av. Raja Gabaglia", "Av. Nossa Senhora do Carmo", "Av. Arthur Bernardes", "Av. Luiz Paulo Franco"] },
                    { nome: "125ª Cia PM", setor: "Prado / Gutierrez / Grajaú / Morro das Pedras", endereco: "Rua Oscar Trompowsky, 1396 - Grajaú", telefone: "(31) 3371-4488 / (31) 3332-4343", bairros: ["Prado", "Morro das Pedras", "Nova Suíssa", "Gutierrez", "Calafate", "Vila Santa Sofia", "Vila São Jorge", "Vila Leonina", "Jardim América", "Nova Granada", "Barroca", "Grajaú"], vias: ["Av. Silva Lobo", "Av. Francisco Sá", "Av. Barão Homem de Melo", "Av. Amazonas", "Av. Tereza Cristina"] },
                    { nome: "127ª Cia PM", setor: "Serra / Sion / Cruzeiro / Mangabeiras", endereco: "Rua Trifana, 839 - Serra", telefone: "(31) 3282-7393", bairros: ["Aglomerado da Serra", "Serra", "Sion", "Cruzeiro", "Vila Nossa Senhora de Fátima", "Vila Marçola", "Vila Santana do Cafezal", "Mangabeiras", "São Lucas", "Carmo", "Anchieta"], vias: ["Av. Afonso Pena (trecho sul)", "Av. do Contorno", "Av. Prudente de Morais", "Av. Mem de Sá"] },
                    { nome: "128ª Cia PM", setor: "Alto Vera Cruz / Taquaril / Santa Efigênia", endereco: "Região Leste / Centro-Sul - BH", telefone: "(31) 2123-1814", bairros: ["Alto Vera Cruz", "Paraíso", "Saudade", "Esplanada", "Conjunto Taquaril", "Santa Efigênia", "Pompéia"], vias: ["Av. dos Andradas", "Av. Mem de Sá", "Av. Jefferson Coelho da Silva"] }
                ],
                apoio_abastecimento: [
                    { nome: "124ª Cia • Base Comunitária Belvedere", endereco: "Av. Luiz Paulo Franco (em frente ao nº 678) - Belvedere, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Luiz+Paulo+Franco+678+Belvedere+BH" },
                    { nome: "Sede 22º BPM (Santa Lúcia)", endereco: "Av. Arthur Bernardes, 1337 - Santa Lúcia, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Arthur+Bernardes+1337+Santa+Lucia+BH" }
                ],
                divisas: "1º BPM (Santa Efigênia) • 5º BPM (Gameleira / Oeste) • 16º BPM (Santa Tereza / Leste) • 34º BPM (Caiçaras / Noroeste) • 41º BPM (Barreiro) • 61º BPM (Sabará) • 1ª Cia PM Ind (Nova Lima)",
                saude_delegacias: [
                    { tipo: "Saúde / Trauma", nome: "Hospital João XXIII (FHEMIG)", endereco: "Av. Professor Alfredo Balena, 400 - Santa Efigênia, BH", telefone: "(31) 3239-9200" },
                    { tipo: "Saúde / Referência", nome: "Hospital Mater Dei Santo Agostinho", endereco: "Rua Mato Grosso, 1100 - Santo Agostinho, BH", telefone: "(31) 3339-9000" },
                    { tipo: "Delegacia / CEFLAN", nome: "CEFLAN II / DEPLAN Centro-Sul", endereco: "Av. Barbacena, 288 - Barro Preto, BH", telefone: "(31) 3330-1600" }
                ],
                contatos: [
                    { setor: "SOU / Sala de Operações 22º BPM", telefone: "(31) 2123-1800" },
                    { setor: "22º BPM (Administração)", telefone: "(31) 3284-8445" },
                    { setor: "124ª Cia PM (Santa Lúcia)", telefone: "(31) 2123-1809" },
                    { setor: "125ª Cia PM (Grajaú / Prado)", telefone: "(31) 3371-4488" },
                    { setor: "127ª Cia PM (Serra)", telefone: "(31) 3282-7393" },
                    { setor: "128ª Cia PM (Alto Vera Cruz)", telefone: "(31) 2123-1814" }
                ]
            },
            {
                nome: "1º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 1º BPM",
                endereco_sede: "Praça Floriano Peixoto, s/n - Santa Efigênia, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Central / 1º BPM", setor: "Centro / Savassi / Funcionários / Barro Preto", endereco: "Praça Floriano Peixoto, s/n - Santa Efigênia", telefone: "190", bairros: ["Centro", "Savassi", "Funcionários", "Lourdes", "Barro Preto", "Carlos Prates", "Floresta", "Boa Viagem", "Lagoinha"], vias: ["Av. Afonso Pena", "Av. Amazonas", "Av. do Contorno", "Av. Cristiano Machado", "Av. Bias Fortes"] }],
                apoio_abastecimento: [{ nome: "Sede 1º BPM", endereco: "Praça Floriano Peixoto, s/n - Santa Efigênia, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Praca+Floriano+Peixoto+Santa+Efigenia+BH" }],
                divisas: "5º BPM (Oeste) • 16º BPM (Leste) • 22º BPM (Centro-Sul) • 34º BPM (Noroeste)",
                saude_delegacias: [{ tipo: "Saúde / Trauma", nome: "Hospital João XXIII", endereco: "Av. Prof. Alfredo Balena, 400 - Santa Efigênia", telefone: "(31) 3239-9200" }, { tipo: "Delegacia / CEFLAN", nome: "CEFLAN Centro / Barreiro", endereco: "Rua Tupis, 149 - Centro, BH", telefone: "197" }],
                contatos: [{ setor: "COPOM / 1ª RPM", telefone: "190" }]
            },
            {
                nome: "5º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 5º BPM A",
                endereco_sede: "Avenida Amazonas, 6455 - Gameleira, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Oeste / 5º BPM", setor: "Gameleira / Padre Eustáquio / Betânia / Arena MRV", endereco: "Avenida Amazonas, 6455 - Gameleira", telefone: "190", bairros: ["Gameleira", "Nova Gameleira", "Califórnia", "Camargos", "Coração Eucarístico", "Dom Bosco", "Dom Cabral", "João Pinheiro", "Madre Gertrudes", "Minas Brasil", "Nova Cintra", "Padre Eustáquio", "Salgado Filho", "Betânia", "Cabana do Pai Tomás", "Estrela do Oriente", "Havaí", "Vista Alegre"], vias: ["Av. Amazonas", "Via Expressa", "Anel Rodoviário", "Av. Tereza Cristina"] }],
                apoio_abastecimento: [{ nome: "Complexo Gameleira / 5º BPM", endereco: "Av. Amazonas, 6455 - Gameleira, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Amazonas+6455+Gameleira+BH" }],
                divisas: "1º BPM (Centro) • 22º BPM (Centro-Sul) • 34º BPM (Noroeste) • 41º BPM (Barreiro) • 39º BPM (Contagem)",
                saude_delegacias: [{ tipo: "Saúde / UPA", nome: "UPA Oeste", endereco: "Av. Barão Homem de Melo, 1710 - Jardim América", telefone: "192" }, { tipo: "Delegacia / CEFLAN", nome: "CEFLAN Oeste / Barreiro", endereco: "Av. Amazonas, 6455 (Região Oeste)", telefone: "197" }],
                contatos: [{ setor: "COPOM / 5º BPM", telefone: "190" }]
            },
            {
                nome: "16º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 16º BPM A",
                endereco_sede: "Rua Tenente Vitorino, 71 - Santa Tereza, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Leste / 16º BPM", setor: "Santa Tereza / Horto / Sagrada Família / Independência", endereco: "Rua Tenente Vitorino, 71 - Santa Tereza", telefone: "190", bairros: ["Santa Tereza", "Horto", "Horto Florestal", "Sagrada Família", "Cidade Nova", "Silveira", "Nova Floresta", "União", "Bairro da Graça", "Colégio Batista", "Renascença", "São Geraldo", "Boa Vista", "Casa Branca", "Santa Inês"], vias: ["Av. dos Andradas", "Av. Silviano Brandão", "Av. José Cândido da Silveira", "Av. Cristiano Machado"] }],
                apoio_abastecimento: [{ nome: "Sede 16º BPM", endereco: "Rua Tenente Vitorino, 71 - Santa Tereza, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Rua+Tenente+Vitorino+71+Santa+Tereza+BH" }],
                divisas: "1º BPM (Centro) • 22º BPM (Centro-Sul) • 13º BPM (Norte) • 61º BPM (Sabará)",
                saude_delegacias: [{ tipo: "Saúde / UPA", nome: "UPA Leste", endereco: "Av. dos Andradas, 7180 - Vera Cruz", telefone: "192" }],
                contatos: [{ setor: "COPOM / 16º BPM", telefone: "190" }]
            },
            {
                nome: "34º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 34º BPM B",
                endereco_sede: "Avenida Américo Vespúcio, 2391 - Caiçara, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Noroeste / Pampulha", setor: "Caiçara / Castelo / Pampulha / Mineirão", endereco: "Av. Américo Vespúcio, 2391 - Caiçara", telefone: "190", bairros: ["Caiçara", "Alípio de Melo", "Castelo", "Ouro Preto", "Paquetá", "São José", "Pampulha", "São Luiz", "Bandeirantes", "Santa Amélia", "Santa Branca", "Itapoã", "Jardim Atlântico", "Serrano", "Glória", "Coqueiros", "Pindorama"], vias: ["Av. Antônio Carlos", "Av. Pedro II", "Av. Carlos Luz", "Av. Portugal", "Anel Rodoviário"] }],
                apoio_abastecimento: [{ nome: "Sede 34º BPM", endereco: "Av. Américo Vespúcio, 2391 - Caiçara, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Americo+Vespucio+2391+Caicara+BH" }],
                divisas: "1º BPM (Centro) • 5º BPM (Oeste) • 13º BPM (Norte) • 49º BPM (Venda Nova) • 18º BPM (Contagem)",
                saude_delegacias: [{ tipo: "Saúde / UPA", nome: "UPA Pampulha / Odilon Behrens", endereco: "Av. Santa Rosa, 120 - São Luiz", telefone: "192" }],
                contatos: [{ setor: "COPOM / 34º BPM", telefone: "190" }]
            },
            {
                nome: "41º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 41º BPM",
                endereco_sede: "Avenida Afonso Vaz de Melo, 650 - Barreiro, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Barreiro / 41º BPM", setor: "Barreiro / Cardoso / Tirol / Jatobá", endereco: "Av. Afonso Vaz de Melo, 650 - Barreiro", telefone: "190", bairros: ["Barreiro", "Cardoso", "Diamante", "Milionários", "Lindéia", "Tirol", "Teixeira Dias", "Vila Pinho", "Vale do Jatobá", "Bonsucesso", "Olaria", "Santa Helena"], vias: ["Av. Afonso Vaz de Melo", "Av. Olinto Meireles", "Av. Sinfrônio Brochado", "Anel Rodoviário"] }],
                apoio_abastecimento: [{ nome: "Sede 41º BPM", endereco: "Av. Afonso Vaz de Melo, 650 - Barreiro, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Afonso+Vaz+de+Melo+650+Barreiro+BH" }],
                divisas: "5º BPM (Oeste) • 22º BPM (Centro-Sul) • 39º BPM (Contagem) • 48º BPM (Ibirité)",
                saude_delegacias: [{ tipo: "Saúde / UPA", nome: "UPA Barreiro / Hospital Metropolitano", endereco: "Av. Sinfrônio Brochado, 1170 - Barreiro", telefone: "192" }],
                contatos: [{ setor: "COPOM / 41º BPM", telefone: "190" }]
            },
            {
                nome: "13º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 13º BPM",
                endereco_sede: "Avenida Dr. Cristiano Guimarães, 2300 - Planalto, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Norte / Planalto", setor: "Planalto / Guarani / Tupi / Floramar", endereco: "Av. Dr. Cristiano Guimarães, 2300 - Planalto", telefone: "190", bairros: ["Planalto", "Guarani", "Tupi", "Aarão Reis", "Floramar", "Heliópolis", "Jaqueline", "Jardim Guanabara", "Providência", "São Bernardo", "Vila Clóris"], vias: ["Av. Cristiano Machado", "Av. Pedro I", "Av. Saramenha", "MG-020"] }],
                apoio_abastecimento: [{ nome: "Sede 13º BPM", endereco: "Av. Dr. Cristiano Guimarães, 2300 - Planalto, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Cristiano+Guimaraes+2300+Planalto+BH" }],
                divisas: "16º BPM (Leste) • 34º BPM (Pampulha) • 49º BPM (Venda Nova) • 35º BPM (Santa Luzia)",
                saude_delegacias: [{ tipo: "Saúde / Hospital", nome: "Hospital Risoleta Tolentino Neves", endereco: "Rua das Gabirobas, 1 - Vila Clóris, BH", telefone: "(31) 3459-3200" }],
                contatos: [{ setor: "COPOM / 13º BPM", telefone: "190" }]
            },
            {
                nome: "49º BPM", isSummaryOnly: true, cidade: "Belo Horizonte", regiao: "1ª RPM • Capital", rede_radio: "REDE: 1ª RPM / 49º BPM",
                endereco_sede: "Avenida Érico Veríssimo, 561 - Venda Nova, Belo Horizonte/MG", telefone_sou: "COPOM 190 / 1ª RPM",
                companhias: [{ nome: "Área Venda Nova / 49º BPM", setor: "Venda Nova / Céu Azul / Justinópolis / Serra Verde", endereco: "Av. Érico Veríssimo, 561 - Venda Nova", telefone: "190", bairros: ["Venda Nova", "Céu Azul", "Copacabana", "Jardim dos Comerciários", "Letícia", "Mantiqueira", "Piratininga", "Rio Branco", "Santa Mônica", "São João Batista", "Serra Verde"], vias: ["Av. Vilarinho", "Av. Padre Pedro Pinto", "Av. Pedro I", "MG-010"] }],
                apoio_abastecimento: [{ nome: "Sede 49º BPM", endereco: "Av. Érico Veríssimo, 561 - Venda Nova, BH", maps_url: "https://www.google.com/maps/search/?api=1&query=Avenida+Erico+Verissimo+561+Venda+Nova+BH" }],
                divisas: "13º BPM (Norte) • 34º BPM (Pampulha) • 40º BPM (Ribeirão das Neves) • 36º BPM (Vespasiano)",
                saude_delegacias: [{ tipo: "Saúde / UPA", nome: "UPA Venda Nova", endereco: "Rua Padre Pedro Pinto, 175 - Venda Nova", telefone: "192" }],
                contatos: [{ setor: "COPOM / 49º BPM", telefone: "190" }]
            },
            {
                nome: "39º BPM", cidade: "Contagem", regiao: "2ª RPM • RMBH", rede_radio: "REDE: 2ª RPM / 39º BPM",
                endereco_sede: "Rua Tiradentes, 2750 - Industrial, Contagem/MG", telefone_sou: "2ª RPM / Contagem",
                companhias: [{ nome: "Área Industrial / Eldorado", setor: "Industrial / Eldorado / Riacho das Pedras", endereco: "Rua Tiradentes, 2750 - Industrial, Contagem", telefone: "190", bairros: ["Eldorado", "Industrial", "Riacho das Pedras", "Novo Riacho", "Inconfidentes", "Água Branca", "Cidade Industrial", "Amazonas", "Bandeirantes", "Flamengo", "Monte Castelo", "Parque São João", "Santa Cruz Industrial"], vias: ["Av. João César de Oliveira", "Av. Cardeal Eugênio Pacelli", "Via Expressa", "BR-381"] }],
                apoio_abastecimento: [{ nome: "Sede 39º BPM", endereco: "Rua Tiradentes, 2750 - Industrial, Contagem/MG", maps_url: "https://www.google.com/maps/search/?api=1&query=Rua+Tiradentes+2750+Industrial+Contagem+MG" }],
                divisas: "18º BPM (Contagem) • 5º BPM (BH Oeste) • 41º BPM (Barreiro) • 48º BPM (Ibirité)",
                saude_delegacias: [{ tipo: "Saúde / Hospital", nome: "Hospital Municipal de Contagem (HMC)", endereco: "Av. João César de Oliveira, 4495 - Contagem", telefone: "(31) 3363-5800" }],
                contatos: [{ setor: "SOU / 2ª RPM", telefone: "190" }]
            }
        ];

        async function loadExternalDadosJson() {
            const mergedUnits = new Map();
            AZIMUTE_EMBEDDED_BATTALIONS.forEach(u => {
                mergedUnits.set(u.nome.toLowerCase(), normalizeBattalionRecord(u, u.cidade));
            });
            try {
                localStorage.removeItem('azimute_unified_units_cache_v1');
                const cached = localStorage.getItem('azimute_unified_units_cache_v2');
                if (cached) {
                    const arr = JSON.parse(cached);
                    if (Array.isArray(arr)) arr.forEach(u => mergedUnits.set(u.nome.toLowerCase(), u));
                }
            } catch (e) {}

            const files = [
                './dados.json',
                './unidades_1rpm.json',
                './unidades_1bpm.json',
                './batalhao_22.json',
                './hospitais_1bpm.json',
                './bsc_1bpm.json',
                './deplan_1bpm.json'
            ];

            await Promise.all(files.map(async (fileUrl) => {
                try {
                    const res = await fetch(fileUrl + '?v=' + Date.now());
                    if (!res.ok) return;
                    const json = await res.json();
                    if (!json || typeof json !== 'object') return;

                    const candidates = [];
                    if (Array.isArray(json.rpm1)) candidates.push(...json.rpm1);
                    if (Array.isArray(json.rpm2)) candidates.push(...json.rpm2);
                    if (Array.isArray(json.unidades)) candidates.push(...json.unidades);
                    if (json.unidade || json.nome || json.batalhao) candidates.push(json);
                    if (!Array.isArray(json)) {
                        Object.values(json).forEach(val => {
                            if (val && typeof val === 'object' && (val.unidade || val.nome || val.batalhao || val.companhias || val.cias)) {
                                candidates.push(val);
                            }
                        });
                    }

                    candidates.forEach(item => {
                        const norm = normalizeBattalionRecord(item, fileUrl.includes('1rpm') || fileUrl.includes('1bpm') || fileUrl.includes('22') ? 'Belo Horizonte' : 'RMBH');
                        if (norm) {
                            const key = norm.nome.toLowerCase();
                            const prev = mergedUnits.get(key);
                            if (!prev || norm.companhias.length >= prev.companhias.length) {
                                mergedUnits.set(key, norm);
                            }
                        }
                    });
                } catch (e) {}
            }));

            const finalList = Array.from(mergedUnits.values());
            AZIMUTE_DB = { all: finalList, rpm1: finalList, rpm2: [] };
            if (typeof window.azSyncRpm1BattalionCards === "function") {
                window.azSyncRpm1BattalionCards();
            }
            if (typeof window.azimuteRefreshGeoDatasets === "function") {
                window.azimuteRefreshGeoDatasets();
            }
            if (typeof azimuteLastGeoLat === 'number' && typeof azimuteLastGeoLon === 'number' && typeof updateOfflineProximityData === 'function') {
                updateOfflineProximityData(azimuteLastGeoLat, azimuteLastGeoLon, null);
            }
            try {
                localStorage.setItem('azimute_unified_units_cache_v2', JSON.stringify(finalList));
            } catch (e) {}
        }

        window.azSyncRpm1BattalionCards = function() {
            const cards = document.querySelectorAll('#view-rpm1 [data-rpm1-bpm]');
            if (!cards.length || !AZIMUTE_DB || !Array.isArray(AZIMUTE_DB.all)) return;
            cards.forEach(card => {
                const bpmName = card.getAttribute('data-rpm1-bpm');
                const unit = AZIMUTE_DB.all.find(u => u.nome && u.nome.toLowerCase() === String(bpmName || '').toLowerCase());
                const hasData = Boolean(unit && Array.isArray(unit.companhias) && unit.companhias.length > 0 && !unit.isSummaryOnly);
                const badge = card.querySelector('.rpm1-badge');
                const title = card.querySelector('.rpm1-title');
                const foot = card.querySelector('.rpm1-foot');
                const status = card.querySelector('.rpm1-status');
                if (hasData) {
                    card.className = 'bg-pmmg-card p-4 rounded-xl border border-pmmg-gold/60 tactical-card cursor-pointer';
                    if (badge) badge.className = 'rpm1-badge text-[10px] bg-pmmg-khakiBadge text-pmmg-gold font-bold px-2 py-0.5 rounded uppercase';
                    if (title) title.className = 'rpm1-title text-lg sm:text-xl font-military text-pmmg-gold font-bold uppercase mt-1';
                    if (foot) foot.className = 'rpm1-foot mt-3 text-[11px] text-pmmg-gold flex items-center justify-between';
                    if (status) status.textContent = 'Dados Carregados • ' + unit.companhias.length + ' Cia(s)';
                } else {
                    card.className = 'bg-pmmg-card p-4 rounded-xl tactical-border tactical-card cursor-pointer';
                    if (badge) badge.className = 'rpm1-badge text-[10px] bg-pmmg-dark text-gray-200 font-bold px-2 py-0.5 rounded uppercase';
                    if (title) title.className = 'rpm1-title text-lg sm:text-xl font-military text-white font-bold uppercase mt-1';
                    if (foot) foot.className = 'rpm1-foot mt-3 text-[11px] text-gray-300 flex items-center justify-between';
                    if (status) status.textContent = 'Área pronta para receber os dados';
                }
            });
        };
        loadExternalDadosJson();

        // Sobrescreve openBattalionPlaceholder para abrir qualquer Batalhão com seus dados reais
        const originalOpenPlaceholder = window.openBattalionPlaceholder;
        window.openBattalionPlaceholder = async function(unitName, city, address) {
            if (!AZIMUTE_DB || !AZIMUTE_DB.all || AZIMUTE_DB.all.length === 0) {
                await loadExternalDadosJson();
            }
            let foundUnit = null;
            if (AZIMUTE_DB && Array.isArray(AZIMUTE_DB.all)) {
                const targetNorm = unitName.toLowerCase().replace(/[^a-z0-9]/g, '');
                foundUnit = AZIMUTE_DB.all.find(u => u.nome.toLowerCase().replace(/[^a-z0-9]/g, '') === targetNorm)
                    || AZIMUTE_DB.all.find(u => u.nome.toLowerCase().includes(unitName.toLowerCase()));
            }

            currentDrawerUnit = foundUnit || {
                nome: unitName,
                cidade: city,
                regiao: city,
                rede_radio: 'REDE: ' + unitName,
                endereco_sede: address,
                telefone_sou: 'Em cadastramento',
                status: 'Área pronta para receber os dados',
                companhias: [],
                apoio_abastecimento: [],
                divisas: 'Envie as divisas desta unidade no chat para preenchermos no arquivo dados.json.',
                saude_delegacias: [],
                contatos: [{ setor: 'SOU', telefone: 'Em cadastramento' }, { setor: 'INTELIGÊNCIA - ' + unitName, telefone: 'Em cadastramento' }]
            };

            document.getElementById('skeletonTitle').textContent = currentDrawerUnit.nome + ' • ' + currentDrawerUnit.cidade;
            document.getElementById('skeletonSubtitle').textContent = 'Sede: ' + currentDrawerUnit.endereco_sede;
            document.getElementById('skeletonRadioBadge').textContent = currentDrawerUnit.rede_radio || ('REDE: ' + currentDrawerUnit.nome);
            document.getElementById('skeletonStatusBadge').textContent = currentDrawerUnit.status || 'Área pronta para receber os dados';
            document.getElementById('skeletonMapsBtn').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(currentDrawerUnit.endereco_sede + ' ' + currentDrawerUnit.cidade);

            showView('skeleton');
            switchDrawerTab('cias');
        };

        window.switchDrawerTab = function switchDrawerTab(tab) {
            ['cias', 'apoio', 'divisas', 'orgaos', 'contatos'].forEach(t => {
                const btn = document.getElementById('dtab-' + t);
                if (btn) {
                    btn.className = (t === tab)
                        ? 'px-3.5 py-2 rounded-lg bg-pmmg-khaki text-pmmg-black font-bold flex items-center gap-1.5'
                        : 'px-3.5 py-2 rounded-lg bg-pmmg-dark text-gray-300 border border-pmmg-border font-medium flex items-center gap-1.5';
                }
            });

            const container = document.getElementById('drawerDynamicBody');
            if (!currentDrawerUnit || !container) return;

            if (tab === 'cias') {
                const cias = currentDrawerUnit.companhias || [];
                if (cias.length === 0) {
                    container.innerHTML = `
                        <div class="bg-pmmg-card p-5 rounded-xl tactical-border space-y-2">
                            <span class="text-[10px] bg-pmmg-khakiBadge text-pmmg-khaki font-bold px-2.5 py-0.5 rounded uppercase">Área pronta para receber os dados</span>
                            <h4 class="text-lg font-bold text-white">Companhias do ${currentDrawerUnit.nome}</h4>
                            <p class="text-xs text-gray-400">Área pronta para receber os dados de Companhias, Bairros e Vias do <strong>${currentDrawerUnit.nome}</strong> via <code>dados.json</code>.</p>
                        </div>`;
                } else {
                    container.innerHTML = cias.map((c, idx) => {
                        const allB = c.bairros || [];
                        const primB = allB.slice(0, 5);
                        const restB = allB.slice(5);
                        const allV = c.vias || [];
                        const dId = 'drawer_' + idx;
                        const telClean = (c.telefone || '').split('/')[0].replace(/\D/g, '');
                        return `
                        <div class="bg-pmmg-card p-4 rounded-xl tactical-border space-y-2.5">
                            <div class="flex flex-wrap justify-between items-center gap-2 border-b border-pmmg-border pb-2">
                                <h4 class="text-lg sm:text-xl font-military text-pmmg-khaki uppercase">${c.nome}${c.setor ? ' • ' + c.setor : ''}</h4>
                                <div class="flex items-center gap-1.5">
                                    ${telClean ? `<a href="tel:${telClean}" class="px-2 py-0.5 bg-pmmg-dark border border-pmmg-gold/40 rounded text-xs font-mono font-bold text-pmmg-gold hover:bg-pmmg-border">${c.telefone}</a>` : `<span class="text-xs font-mono font-bold text-white">${c.telefone || ''}</span>`}
                                </div>
                            </div>
                            <p class="text-xs text-gray-300 flex flex-wrap items-center justify-between gap-2">
                                <span><strong>Endereço:</strong> ${c.endereco || ''}</span>
                                ${c.endereco ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.endereco + ' ' + currentDrawerUnit.cidade)}" target="_blank" class="text-[10px] font-bold text-pmmg-khaki underline shrink-0">Abrir no Maps</a>` : ''}
                            </p>
                            <div class="text-[11px] space-y-1.5">
                                <div class="flex items-center justify-between">
                                    <strong class="text-pmmg-khaki">Principais Bairros:</strong>
                                    ${restB.length > 0 ? `<button type="button" onclick="toggleCiaMoreBairros('${dId}')" id="btnMoreBairros-${dId}" class="px-2 py-0.5 rounded bg-pmmg-dark hover:bg-pmmg-border text-pmmg-khaki border border-pmmg-gold/40 text-[10px] font-bold cursor-pointer">Ver mais (${restB.length})</button>` : ''}
                                </div>
                                <div class="flex flex-wrap gap-1">
                                    ${primB.map(b => `<span class="px-2 py-0.5 bg-pmmg-dark border border-pmmg-border rounded text-gray-200 inline-flex items-center gap-1">${b}</span>`).join('')}
                                </div>
                                ${restB.length > 0 ? `<div id="moreBairros-${dId}" class="hidden flex-wrap gap-1 pt-1 border-t border-pmmg-border/60">${restB.map(b => `<span class="px-2 py-0.5 bg-pmmg-dark border border-pmmg-border rounded text-gray-300 inline-flex items-center gap-1">${b}</span>`).join('')}</div>` : ''}
                            </div>
                            ${allV.length > 0 ? `<div class="bg-pmmg-dark border border-pmmg-border rounded-lg p-2.5 space-y-1.5 text-[11px]"><strong class="text-pmmg-khaki block">Principais Corredores e Ruas:</strong><div class="flex flex-wrap gap-1">${allV.map(v => `<span class="px-2 py-0.5 bg-pmmg-card border border-pmmg-border rounded text-gray-200">${v}</span>`).join('')}</div></div>` : ''}
                        </div>`;
                    }).join('');
                }
            } else if (tab === 'apoio') {
                const apoios = currentDrawerUnit.apoio_abastecimento || [];
                container.innerHTML = apoios.length ? apoios.map(a => `
                    <div class="bg-pmmg-card p-4 rounded-xl tactical-border flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-white text-sm">${a.nome}</h4>
                            <p class="text-xs text-gray-400">${a.endereco}</p>
                        </div>
                        <a href="${a.maps_url || '#'}"target="_blank"class="px-3 py-1.5 bg-pmmg-dark text-pmmg-khaki border border-pmmg-border rounded text-xs font-bold">Mapa</a>
                    </div>`).join('') : `
                    <div class="bg-pmmg-card p-5 rounded-xl tactical-border">
                        <h4 class="text-base font-bold text-white">Pontos de Apoio e Abastecimento (${currentDrawerUnit.nome})</h4>
                        <p class="text-xs text-gray-400 mt-1">Área pronta para receber os dados de apoio e abastecimento desta unidade via <code>dados.json</code>.</p>
                    </div>`;
            } else if (tab === 'divisas') {
                container.innerHTML = `
                    <div class="bg-pmmg-card p-5 rounded-xl tactical-border space-y-2">
                        <span class="text-[10px] bg-pmmg-khakiBadge text-pmmg-gold font-bold px-2.5 py-0.5 rounded uppercase">Mapeamento Territorial</span>
                        <h4 class="text-lg font-bold text-white">Divisas & Pontos de Cerco do ${currentDrawerUnit.nome}</h4>
                        <p class="text-xs text-gray-200 leading-relaxed">${currentDrawerUnit.divisas || 'Em alimentação.'}</p>
                    </div>`;
            } else if (tab === 'orgaos') {
                const orgaos = currentDrawerUnit.saude_delegacias || [];
                container.innerHTML = orgaos.length ? orgaos.map(o => `
                    <div class="bg-pmmg-card p-4 rounded-xl tactical-border">
                        <span class="text-[10px] text-pmmg-khaki font-bold uppercase">${o.tipo}</span>
                        <h4 class="text-base font-bold text-white">${o.nome}</h4>
                        <p class="text-xs text-gray-300">${o.endereco} • Tel: ${o.telefone || '--'}</p>
                    </div>`).join('') : `
                    <div class="bg-pmmg-card p-5 rounded-xl tactical-border">
                        <h4 class="text-base font-bold text-white">UPAs, Hospitais e CEFLAN (${currentDrawerUnit.nome})</h4>
                        <p class="text-xs text-gray-400 mt-1">Área pronta para receber os dados de saúde e delegacias desta unidade.</p>
                    </div>`;
            } else if (tab === 'contatos') {
                const contatos = currentDrawerUnit.contatos || [];
                container.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">` + contatos.map(ct => `
                    <div class="bg-pmmg-card p-4 rounded-xl tactical-border flex justify-between items-center">
                        <div>
                            <h5 class="font-bold text-pmmg-khaki text-sm">${ct.setor}</h5>
                            <p class="text-base font-mono text-white font-bold mt-0.5">${ct.telefone}</p>
                        </div>
                        <a href="tel:${(ct.telefone || '').replace(/\D/g,'')}"class="p-2.5 bg-pmmg-khaki text-pmmg-black rounded-lg font-bold text-xs">Ligar</a>
                    </div>`).join('') + `</div>`;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }