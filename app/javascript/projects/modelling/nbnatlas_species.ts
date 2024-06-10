import { CheckboxControlOptions } from "./controls/checkboxgroup"
import { SelectControlOptions } from "./controls/select"


type SpeciesCheckboxControlOptions = CheckboxControlOptions & {
    familyId: number
    scientificSpeciesName: string
    scientificSubSpeciesName?: string
}

type SpeciesFamilySelectControlOptions = SelectControlOptions & {
    family: string
}

export const speciesFamilyList: SpeciesFamilySelectControlOptions[] = [
    {
        name: 'Ladybird (Coccinellidae)',
        id: 1,
        family: 'Coccinellidae'
    },
    {
        name: 'Eel (Anguillidae)',
        id: 2,
        family: 'Anguillidae'
    },
    {
        name: 'Salmon & Trout (Salmonidae)',
        id: 3,
        family: 'Salmonidae'
    },
    {
        name: 'Soapberry (Sapindaceae)',
        id: 4,
        family: 'Sapindaceae'
    },
    {
        name: 'Moschatel (Adoxaceae)',
        id: 5,
        family: 'Adoxaceae'
    },
    {
        name: 'Amaryllidaceae',
        id: 6,
        family: 'Amaryllidaceae'
    },
    {
        name: 'Primrose (Primulaceae)',
        id: 7,
        family: 'Primulaceae'
    },
    {
        name: 'Buttercup (Ranunculaceae)',
        id: 8,
        family: 'Ranunculaceae'
    },
    {
        name: 'Blechnaceae',
        id: 9,
        family: 'Blechnaceae'
    },
    {
        name: 'Grasses (Poaceae)',
        id: 10,
        family: 'Poaceae'
    },
    {
        name: 'Bellflowers (Campanulaceae)',
        id: 11,
        family: 'Campanulaceae'
    },
    {
        name: 'Crucifers (Brassicaceae)',
        id: 12,
        family: 'Brassicaceae'
    },
    {
        name: 'Sedges (Cyperaceae)',
        id: 13,
        family: 'Cyperaceae'
    },
    {
        name: 'Birch (Betulaceae)',
        id: 14,
        family: 'Betulaceae'
    },
    {
        name: 'Saxifrage (Saxifragaceae)',
        id: 15,
        family: 'Saxifragaceae'
    },
    {
        name: 'Umbellifers (Apiaceae)',
        id: 16,
        family: 'Apiaceae'
    },
    {
        name: 'Asparagus (Asparagaceae)',
        id: 17,
        family: 'Asparagaceae'
    },
    {
        name: 'Rose (Rosaceae)',
        id: 18,
        family: 'Rosaceae'
    },
    {
        name: 'Thymelaeaceae',
        id: 19,
        family: 'Thymelaeaceae'
    },
    {
        name: 'Honeysuckle (Caprifoliaceae)',
        id: 20,
        family: 'Caprifoliaceae'
    },
    {
        name: 'Wood ferns (Dryopteridaceae)',
        id: 21,
        family: 'Dryopteridaceae'
    },
    {
        name: 'Orchids (Orchidaceae)',
        id: 22,
        family: 'Orchidaceae'
    },
    {
        name: 'Horsetails (Equisetaceae)',
        id: 23,
        family: 'Equisetaceae'
    },
    {
        name: 'Spurge (Euphorbiaceae)',
        id: 24,
        family: 'Euphorbiaceae'
    },
    {
        name: 'Buckthorn (Rhamnaceae)',
        id: 25,
        family: 'Rhamnaceae'
    },
    {
        name: 'Madder (Rubiaceae)',
        id: 26,
        family: 'Rubiaceae'
    },
    {
        name: 'Saint John\'s wort (Hypericaceae)',
        id: 27,
        family: 'Hypericaceae'
    },
    {
        name: 'Holly (Aquifoliaceae)',
        id: 28,
        family: 'Aquifoliaceae'
    },
    {
        name: 'Irises (Iridaceae)',
        id: 29,
        family: 'Iridaceae'
    },
    {
        name: 'Mint (Lamiaceae)',
        id: 30,
        family: 'Lamiaceae'
    },
    {
        name: 'Broomrape (Orobanchaceae)',
        id: 31,
        family: 'Orobanchaceae'
    },
    {
        name: 'Bean (Fabaceae)',
        id: 32,
        family: 'Fabaceae'
    },
    {
        name: 'Rushes (Juncaceae)',
        id: 33,
        family: 'Juncaceae'
    },
    {
        name: 'Carnation (Caryophyllaceae)',
        id: 34,
        family: 'Caryophyllaceae'
    },
    {
        name: 'Marsh ferns (Thelypteridaceae)',
        id: 35,
        family: 'Thelypteridaceae'
    },
    {
        name: 'Wood-sorrel (Oxalidaceae)',
        id: 36,
        family: 'Oxalidaceae'
    },
    {
        name: 'Bunchflower (Melanthiaceae)',
        id: 37,
        family: 'Melanthiaceae'
    },
    {
        name: 'Aspleniaceae',
        id: 38,
        family: 'Aspleniaceae'
    },
    {
        name: 'Common ferns (Polypodiaceae)',
        id: 39,
        family: 'Polypodiaceae'
    },
    {
        name: 'Willow (Salicaceae)',
        id: 40,
        family: 'Salicaceae'
    },
    {
        name: 'Beech (Fagaceae)',
        id: 41,
        family: 'Fagaceae'
    },
    {
        name: 'Flax (Linaceae)',
        id: 42,
        family: 'Linaceae'
    },
    {
        name: 'Currant (Grossulariaceae)',
        id: 43,
        family: 'Grossulariaceae'
    },
    {
        name: 'Stonecrop (Crassulaceae)',
        id: 44,
        family: 'Crassulaceae'
    },
    {
        name: 'Composite (Asteraceae)',
        id: 45,
        family: 'Asteraceae'
    },
    {
        name: 'True yam (Dioscoreaceae)',
        id: 46,
        family: 'Dioscoreaceae'
    },
    {
        name: 'Mallows (Malvaceae)',
        id: 47,
        family: 'Malvaceae'
    },
    {
        name: 'Elm (Ulmaceae)',
        id: 48,
        family: 'Ulmaceae'
    },
    {
        name: 'Heaths (Ericaceae)',
        id: 49,
        family: 'Ericaceae'
    },
    {
        name: 'Plantains (Plantaginaceae)',
        id: 50,
        family: 'Plantaginaceae'
    },
    {
        name: 'Viola (Violaceae)',
        id: 51,
        family: 'Violaceae'
    },
    {
        name: 'Larks (Alaudidae)',
        id: 52,
        family: 'Alaudidae'
    },
    {
        name: 'Finches (Fringillidae)',
        id: 53,
        family: 'Fringillidae'
    },
    {
        name: 'Buntings (Emberizidae)',
        id: 54,
        family: 'Emberizidae'
    },
    {
        name: 'Sandpipers (Scolopacidae)',
        id: 55,
        family: 'Scolopacidae'
    },
    {
        name: 'Passerine finches (Passeridae)',
        id: 56,
        family: 'Passeridae'
    },
    {
        name: 'Grouse (Phasianidae)',
        id: 57,
        family: 'Phasianidae'
    },
    {
        name: 'Starlings (Sturnidae)',
        id: 58,
        family: 'Sturnidae'
    },
    {
        name: 'Thrushes (Turdidae)',
        id: 59,
        family: 'Turdidae'
    },
    {
        name: 'Doves (Columbidae)',
        id: 60,
        family: 'Columbidae'
    }
]

export const speciesList: SpeciesCheckboxControlOptions[] = [
    {
        familyId: 1,
        name: 'Anatis ocellata (Eyed ladybird)',
        id: 1,
        scientificSpeciesName: 'Anatis ocellata'
    },
    {
        familyId: 1,
        name: 'Myzia oblongoguttata (Striped ladybird)',
        id: 2,
        scientificSpeciesName: 'Myzia oblongoguttata'
    }, 
    {
        familyId: 1,
        name: 'Coccinella 7‐punctata (Seven-spot ladybird)',
        id: 3,
        scientificSpeciesName: 'Coccinella septempunctata'
    },
    {
        familyId: 1,
        name: 'Harmonia 4-punctata (Cream-streaked ladybird)',
        id: 4,
        scientificSpeciesName: 'Harmonia quadripunctata'
    },
    {
        familyId: 1,
        name: 'Halyzia 16-guttata (Orange ladybird)',
        id: 5,
        scientificSpeciesName: 'Halyzia sedecimguttata'
    },
    {
        familyId: 1,
        name: 'Adalia 2-punctata (Two-spot ladybird)',
        id: 6,
        scientificSpeciesName: 'Adalia bipunctata'
    },
    {
        familyId: 1,
        name: 'Calvia 14-guttata (Cream-spot ladybird)',
        id: 7,
        scientificSpeciesName: 'Calvia quattuordecimguttata'
    },
    {
        familyId: 1,
        name: 'Chilocorus renipustulatus (Kidney-spot ladybird)',
        id: 8,
        scientificSpeciesName: 'Chilocorus renipustulatus'
    },
    {
        familyId: 1,
        name: 'Hippoidea variegata (Adonis` ladybird)',
        id: 9,
        scientificSpeciesName: 'Hippodamia variegata'
    },
    {
        familyId: 1,
        name: 'Adalia 10-punctata (10-spot ladybird)',
        id: 10,
        scientificSpeciesName: 'Adalia decempunctata'
    },
    {
        familyId: 1,
        name: 'Propylea 14-punctata (14-spot ladybird)',
        id: 11,
        scientificSpeciesName: 'Propylea quattuordecimpunctata'
    },
    {
        familyId: 1,
        name: 'Exochomus 4-pustulatus (Pine ladybird)',
        id: 12,
        scientificSpeciesName: 'Exochomus quadripustulatus'
    },
    {
        familyId: 1,
        name: 'Psyllobora 22-punctata (22-spot ladybird)',
        id: 13,
        scientificSpeciesName: 'Psyllobora vigintiduopunctata'
    },
    {
        familyId: 1,
        name: 'Subcoccinella 24-punctata (24-spot ladybird)',
        id: 14,
        scientificSpeciesName: 'Subcoccinella vigintiquattuorpunctata'
    },
    {
        familyId: 1,
        name: 'Tytthaspis 16‐punctata (16-spot ladybird)',
        id: 15,
        scientificSpeciesName: 'Tytthaspis sedecimpunctata'
    },
    {
        familyId: 2,
        name: 'European eel (Anguilla anguilla)',
        id: 16,
        scientificSpeciesName: 'Anguilla anguilla'
    },
    {
        familyId: 3,
        name: 'Sea/Brown trout (Salmo trutta)',
        id: 17,
        scientificSpeciesName: 'Salmo trutta'
    },
    {
        familyId: 3,
        name: 'Brown trout (Salmo trutta subsp. fario)',
        id: 18,
        scientificSpeciesName: 'Salmo trutta',
        scientificSubSpeciesName: 'subsp. fario'
    },
    {
        familyId: 3,
        name: 'Sea trout (Salmo trutta subsp. trutta)',
        id: 19,
        scientificSpeciesName: 'Salmo trutta',
        scientificSubSpeciesName: 'subsp. trutta'
    },
    {
        familyId: 4,
        name: 'Field Maple (Acer campestre L.)',
        id: 20,
        scientificSpeciesName: 'Acer campestre'
    },
    {
        familyId: 5,
        name: 'Moschatel (Adoxa moschatellina L.)',
        id: 21,
        scientificSpeciesName: 'Adoxa moschatellina'
    },
    {
        familyId: 6,
        name: 'Ramsons (Allium ursinum)',
        id: 22,
        scientificSpeciesName: 'Allium ursinum'
    },
    {
        familyId: 7,
        name: 'Chaffweed (Centunculus minimus)',
        id: 23,
        scientificSpeciesName: 'Centunculus minimus'
    },
    {
        familyId: 8,
        name: 'Wood Anemone (Anemone nemorosa)',
        id: 24,
        scientificSpeciesName: 'Anemone nemorosa'
    },
    {
        familyId: 8,
        name: 'Columbine (Aquilegia vulgaris)',
        id: 25,
        scientificSpeciesName: 'Aquilegia vulgaris'
    },
    {
        familyId: 9,
        name: 'Hard Fern (Blechnum spicant)',
        id: 26,
        scientificSpeciesName: 'Blechnum spicant'
    },
    {
        familyId: 10,
        name: 'Hairy-brome (Bromopsis ramosa)',
        id: 27,
        scientificSpeciesName: 'Bromopsis ramosa'
    },
    {
        familyId: 10,
        name: 'Wood Small-reed (Calamagrostis epigejos)',
        id: 28,
        scientificSpeciesName: 'Calamagrostis epigejos'
    },
    {
        familyId: 11,
        name: 'Nettle-leaved Bellflower (Campanula trachelium)',
        id: 29,
        scientificSpeciesName: 'Campanula trachelium'
    },
    {
        familyId: 12,
        name: 'Large Bittercress (Cardamine amara)',
        id: 30,
        scientificSpeciesName: 'Cardamine amara'
    },
    {
        familyId: 13,
        name: 'Smooth-stalked Sedge (Carex laevigata)',
        id: 31,
        scientificSpeciesName: 'Carex laevigata'
    },
    {
        familyId: 13,
        name: 'Pale Sedge (Carex pallescens)',
        id: 32,
        scientificSpeciesName: 'Carex pallescens'
    },
    {
        familyId: 13,
        name: 'Pendulous Sedge (Carex pendula)',
        id: 33,
        scientificSpeciesName: 'Carex pendula'
    },
    {
        familyId: 13,
        name: 'Remote Sedge (Carex remota)',
        id: 34,
        scientificSpeciesName: 'Carex remota'
    },
    {
        familyId: 13,
        name: 'Thin-spiked Wood Sedge (Carex strigosa)',
        id: 35,
        scientificSpeciesName: 'Carex strigosa'
    },
    {
        familyId: 13,
        name: 'Wood Sedge (Carex sylvatica)',
        id: 36,
        scientificSpeciesName: 'Carex sylvatica'
    },
    {
        familyId: 14,
        name: 'Hornbeam (Carpinus betulus)',
        id: 37,
        scientificSpeciesName: 'Carpinus betulus'
    },
    {
        familyId: 15,
        name: 'Opposite-leaved Golden-saxifrage (Chrysosplenium oppositifolium)',
        id: 38,
        scientificSpeciesName: 'Chrysosplenium oppositifolium'
    },
    {
        familyId: 16,
        name: 'Pignut (Conopodium majus)',
        id: 39,
        scientificSpeciesName: 'Conopodium majus'
    },
    {
        familyId: 17,
        name: 'Lily-of-the-valley (Convallaria majalis)',
        id: 40,
        scientificSpeciesName: 'Convallaria majalis'
    },
    {
        familyId: 18,
        name: 'Midland Hawthorn (Crataegus laevigata)',
        id: 41,
        scientificSpeciesName: 'Crataegus laevigata'
    },
    {
        familyId: 19,
        name: 'Spurge-laurel (Daphne laureola)',
        id: 42,
        scientificSpeciesName: 'Daphne laureola'
    },
    {
        familyId: 20,
        name: 'Small teasel (Dipsacus pilosus)',
        id: 43,
        scientificSpeciesName: 'Dipsacus pilosus'
    },
    {
        familyId: 21,
        name: 'Hay-scented Buckler-fern (Dryopteris aemula)',
        id: 44,
        scientificSpeciesName: 'Dryopteris aemula'
    },
    {
        familyId: 21,
        name: 'Scaly male-fern (Dryopteris affinis)',
        id: 45,
        scientificSpeciesName: 'Dryopteris affinis'
    },
    {
        familyId: 21,
        name: 'Narrow Buckler-fern (Dryopteris carthusiana)',
        id: 46,
        scientificSpeciesName: 'Dryopteris carthusiana'
    }, 
    {
        familyId: 10,
        name: 'Bearded Couch (Elymus caninus)',
        id: 47,
        scientificSpeciesName: 'Elymus caninus'
    },
    {
        familyId: 22,
        name: 'Broad-leaved Helleborine (Epipactis helleborine)',
        id: 48,
        scientificSpeciesName: 'Epipactis helleborine'
    },
    {
        familyId: 22,
        name: 'Violet Helleborine (Epipactis purpurata)',
        id: 49,
        scientificSpeciesName: 'Epipactis purpurata'
    },
    {
        familyId: 23,
        name: 'Wood Horsetail (Equisetum sylvaticum)',
        id: 50,
        scientificSpeciesName: 'Equisetum sylvaticum'
    },
    {
        familyId: 24,
        name: 'Wood Spurge (Euphorbia amygdaloides)',
        id: 51,
        scientificSpeciesName: 'Euphorbia amygdaloides'
    },
    {
        familyId: 10,
        name: 'Giant Fescue (Festuca gigantea)',
        id: 52,
        scientificSpeciesName: 'Festuca gigantea'
    },
    {
        familyId: 25,
        name: 'Alder Buckthorn (Frangula alnus)',
        id: 53,
        scientificSpeciesName: 'Frangula alnus'
    },
    {
        familyId: 26,
        name: 'Sweet Woodruff (Galium odoratum)',
        id: 54,
        scientificSpeciesName: 'Galium odoratum'
    },
    {
        familyId: 8,
        name: 'Green Hellebore (Helleborus viridis)',
        id: 55,
        scientificSpeciesName: 'Helleborus viridis'
    },
    {
        familyId: 10,
        name: 'Creeping Soft-grass (Holcus mollis)',
        id: 56,
        scientificSpeciesName: 'Holcus mollis'
    },
    {
        familyId: 17,
        name: 'Bluebell (Hyacinthoides non-scripta)',
        id: 57,
        scientificSpeciesName: 'Hyacinthoides non-scripta'
    },
    {
        familyId: 27,
        name: 'Tutsan (Hypericum androsaemum)',
        id: 58,
        scientificSpeciesName: 'Hypericum androsaemum'
    },
    {
        familyId: 27,
        name: 'St John\'s-wort (Hypericum perforatum)',
        id: 59,
        scientificSpeciesName: 'Hypericum perforatum'
    },
    {
        familyId: 28,
        name: 'Holly (Ilex aquifolium)',
        id: 60,
        scientificSpeciesName: 'Ilex aquifolium'
    },
    {
        familyId: 29,
        name: 'Stinking Iris (Iris foetidissima)',
        id: 61,
        scientificSpeciesName: 'Iris foetidissima'
    },
    {
        familyId: 30,
        name: 'Yellow Archangel (Lamiastrum galeobdolon)',
        id: 62,
        scientificSpeciesName: 'Lamiastrum galeobdolon'
    },
    {
        familyId: 31,
        name: 'Toothwort (Lathraea squamaria)',
        id: 63,
        scientificSpeciesName: 'Lathraea squamaria'
    },
    {
        familyId: 32,
        name: 'Bitter Vetch (Lathyrus linifolius)',
        id: 64,
        scientificSpeciesName: 'Lathyrus linifolius'
    },
    {
        familyId: 32,
        name: 'Narrow leaved Everlasting-pea (Lathyrus sylvestris)',
        id: 65,
        scientificSpeciesName: 'Lathyrus sylvestris'
    },
    {
        familyId: 33,
        name: 'Southern Wood-rush (Luzula forsteri)',
        id: 66,
        scientificSpeciesName: 'Luzula forsteri'
    },
    {
        familyId: 33,
        name: 'Hairy Wood-rush (Luzula pilosa)',
        id: 67,
        scientificSpeciesName: 'Luzula pilosa'
    },
    {
        familyId: 33,
        name: 'Great Wood-rush (Luzula sylvatica)',
        id: 68,
        scientificSpeciesName: 'Luzula sylvatica'
    },
    {
        familyId: 7,
        name: 'Yellow Pimpernel (Lysimachia nemorum)',
        id: 69,
        scientificSpeciesName: 'Lysimachia nemorum'
    },
    {
        familyId: 18,
        name: 'Crab Apple (Malus sylvestris)',
        id: 70,
        scientificSpeciesName: 'Malus sylvestris'
    },
    {
        familyId: 31,
        name: 'Common Cow-wheat (Melampyrum pratense)',
        id: 71,
        scientificSpeciesName: 'Melampyrum pratense'
    },
    {
        familyId: 10,
        name: 'Wood Melick (Melica uniflora)',
        id: 72,
        scientificSpeciesName: 'Melica uniflora'
    },
    {
        familyId: 10,
        name: 'Wood Millet (Milium effusum)',
        id: 73,
        scientificSpeciesName: 'Milium effusum'
    },
    {
        familyId: 34,
        name: 'Three-nerved Sandwort (Moehringia trinervia)',
        id: 74,
        scientificSpeciesName: 'Moehringia trinervia'
    },
    {
        familyId: 6,
        name: 'Wild Daffodil (Narcissus pseudonarcissus)',
        id: 75,
        scientificSpeciesName: 'Narcissus pseudonarcissus'
    },
    {
        familyId: 22,
        name: 'Bird\'s-nest Orchid (Neottia nidus-avis)',
        id: 76,
        scientificSpeciesName: 'Neottia nidus-avis'
    },
    {
        familyId: 22,
        name: 'Early Purple Orchid (Orchis mascula)',
        id: 77,
        scientificSpeciesName: 'Orchis mascula'
    },
    {
        familyId: 22,
        name: 'Lady Orchid (Orchis purpurea)',
        id: 78,
        scientificSpeciesName: 'Orchis purpurea'
    },
    {
        familyId: 35,
        name: 'Lemon-scented Fern (Oreopteris limbosperma)',
        id: 79,
        scientificSpeciesName: 'Oreopteris limbosperma'
    },
    {
        familyId: 36,
        name: 'Wood-sorrel (Oxalis acetosella)',
        id: 80,
        scientificSpeciesName: 'Oxalis acetosella'
    },
    {
        familyId: 37,
        name: 'Herb Paris (Paris quadrifolia)',
        id: 81,
        scientificSpeciesName: 'Paris quadrifolia'
    },
    {
        familyId: 38,
        name: 'Harts-tongue Fern (Phyllitis scolopendrium)',
        id: 82,
        scientificSpeciesName: 'Phyllitis scolopendrium'
    },
    {
        familyId: 16,
        name: 'Greater Burnet-saxifrage (Pimpinella major)',
        id: 83,
        scientificSpeciesName: 'Pimpinella major'
    },
    {
        familyId: 22,
        name: 'Greater Butterfly-orchid (Platanthera chlorantha)',
        id: 84,
        scientificSpeciesName: 'Platanthera chlorantha'
    },
    {
        familyId: 10,
        name: 'Wood meadow-grass (Poa nemoralis)',
        id: 85,
        scientificSpeciesName: 'Poa nemoralis'
    },
    {
        familyId: 17,
        name: 'Solomon\'s-seal (Polygonatum multiflorum)',
        id: 86,
        scientificSpeciesName: 'Polygonatum multiflorum'
    },
    {
        familyId: 39,
        name: 'Polypody (Polypodium vulgare)',
        id: 87,
        scientificSpeciesName: 'Polypodium vulgare'
    },
    {
        familyId: 21,
        name: 'Hard shield-fern (Polystichum aculeatum)',
        id: 88,
        scientificSpeciesName: 'Polystichum aculeatum'
    },
    {
        familyId: 21,
        name: 'Soft shield-fern (Polystichum setiferum)',
        id: 89,
        scientificSpeciesName: 'Polystichum setiferum'
    },
    {
        familyId: 40,
        name: 'Aspen (Populus tremula)',
        id: 90,
        scientificSpeciesName: 'Populus tremula'
    },
    {
        familyId: 18,
        name: 'Barren Strawberry (Potentilla sterilis)',
        id: 91,
        scientificSpeciesName: 'Potentilla sterilis'
    },
    {
        familyId: 18,
        name: 'Wild Cherry (Prunus avium)',
        id: 92,
        scientificSpeciesName: 'Prunus avium'
    },
    {
        familyId: 18,
        name: 'Bird Cherry (Prunus padus)',
        id: 93,
        scientificSpeciesName: 'Prunus padus'
    },
    {
        familyId: 41,
        name: 'Sessile Oak (Quercus petraea)',
        id: 94,
        scientificSpeciesName: 'Quercus petraea'
    },
    {
        familyId: 42,
        name: 'Allseed (Radiola linoides)',
        id: 95,
        scientificSpeciesName: 'Radiola linoides'
    },
    {
        familyId: 8,
        name: 'Goldilocks Buttercup (Ranunculus auricomus)',
        id: 96,
        scientificSpeciesName: 'Ranunculus auricomus'
    },
    {
        familyId: 43,
        name: 'Blackcurrant (Ribes nigrum)',
        id: 97,
        scientificSpeciesName: 'Ribes nigrum'
    },
    {
        familyId: 43,
        name: 'Redcurrant (Ribes rubrum)',
        id: 98,
        scientificSpeciesName: 'Ribes rubrum'   
    },
    {
        familyId: 18,
        name: 'Field Rose (Rosa arvensis)',
        id: 99,
        scientificSpeciesName: 'Rosa arvensis'
    },
    {
        familyId: 17,
        name: 'Butcher\'s-broom (Ruscus aculeatus)',
        id: 100,
        scientificSpeciesName: 'Ruscus aculeatus'
    },
    {
        familyId: 16,
        name: 'Sanicle (Sanicula europaea)',
        id: 101,
        scientificSpeciesName: 'Sanicula europaea'
    },
    {
        familyId: 13,
        name: 'Wood Club-rush (Scirpus sylvaticus)',
        id: 102,
        scientificSpeciesName: 'Scirpus sylvaticus'
    },
    {
        familyId: 30,
        name: 'Lesser Skullcap (Scutellaria minor)',
        id: 103,
        scientificSpeciesName: 'Scutellaria minor'
    },
    {
        familyId: 44,
        name: 'Orpine (Sedum telephium)',
        id: 104,
        scientificSpeciesName: 'Sedum telephium'
    },
    {
        familyId: 45,
        name: 'Saw-wort (Serratula tinctoria)',
        id: 105,
        scientificSpeciesName: 'Serratula tinctoria'
    },
    {
        familyId: 45,
        name: 'Goldenrod (Solidago virgaurea)',
        id: 106,
        scientificSpeciesName: 'Solidago virgaurea'
    },
    {
        familyId: 18,
        name: 'Wild Service-tree (Sorbus torminalis)',
        id: 107,
        scientificSpeciesName: 'Sorbus torminalis'
    },
    {
        familyId: 30,
        name: 'Betony (Stachys officinalis)',
        id: 108,
        scientificSpeciesName: 'Stachys officinalis'
    },
    {
        familyId: 46,
        name: 'Black Bryony (Dioscorea communis)',
        id: 109,
        scientificSpeciesName: 'Dioscorea communis'
    },
    {
        familyId: 47,
        name: 'Small-leaved Lime (Tilia cordata)',
        id: 110,
        scientificSpeciesName: 'Tilia cordata'
    },
    {
        familyId: 48,
        name: 'Wych Elm (Ulmus glabra)',
        id: 111,
        scientificSpeciesName: 'Ulmus glabra'
    },
    {
        familyId: 49,
        name: 'Billberry (Vaccinium myrtillus)',
        id: 112,
        scientificSpeciesName: 'Vaccinium myrtillus'
    },
    {
        familyId: 50,
        name: 'Wood Speedwell (Veronica montana)',
        id: 113,
        scientificSpeciesName: 'Veronica montana'
    },
    {
        familyId: 5,
        name: 'Guelder-rose (Viburnum opulus)',
        id: 114,
        scientificSpeciesName: 'Viburnum opulus'
    },
    {
        familyId: 32,
        name: 'Bush Vetch (Vicia sepium)',
        id: 115,
        scientificSpeciesName: 'Vicia sepium'
    },
    {
        familyId: 32,
        name: 'Wood Vetch (Vicia sylvatica)',
        id: 116,
        scientificSpeciesName: 'Vicia sylvatica'
    },
    {
        familyId: 51,
        name: 'Marsh Violet (Viola palustris)',
        id: 117,
        scientificSpeciesName: 'Viola palustris'
    },
    {
        familyId: 51,
        name: 'Early Dog-violet (Viola reichenbachiana)',
        id: 118,
        scientificSpeciesName: 'Viola reichenbachiana'
    },
    {
        familyId: 11,
        name: 'Ivy-leaved Bellflower (Wahlenbergia hederacea)',
        id: 119,
        scientificSpeciesName: 'Wahlenbergia hederacea'
    },
    {
        familyId: 52,
        name: 'Skylark (Alauda arvensis)',
        id: 120,
        scientificSpeciesName: 'Alauda arvensis'
    },
    {
        familyId: 53,
        name: 'Linnet (Linaria cannabina)',
        id: 121,
        scientificSpeciesName: 'Linaria cannabina'
    },
    {
        familyId: 54,
        name: 'Yellowhammer (Emberiza citrinella)',
        id: 122,
        scientificSpeciesName: 'Emberiza citrinella'
    },
    {
        familyId: 54,
        name: 'Reed Bunting (Emberiza schoeniclus)',
        id: 123,
        scientificSpeciesName: 'Emberiza schoeniclus'
    },
    {
        familyId: 55,
        name: 'Curlew (Numenius arquata)',
        id: 124,
        scientificSpeciesName: 'Numenius arquata'
    },
    {
        familyId: 56,
        name: 'Tree Sparrow (Passer montanus)',
        id: 125,
        scientificSpeciesName: 'Passer montanus'
    },
    {
        familyId: 57,
        name: 'Grey Partridge (Perdix perdix)',
        id: 126,
        scientificSpeciesName: 'Perdix perdix'
    },
    {
        familyId: 53,
        name: 'Bullfinch (Pyrrhula pyrrhula)',
        id: 127,
        scientificSpeciesName: 'Pyrrhula pyrrhula'
    },
    {
        familyId: 58,
        name: 'Starling (Sturnus vulgaris)',
        id: 128,
        scientificSpeciesName: 'Sturnus vulgaris'
    },
    {
        familyId: 59,
        name: 'Song Thrush (Turdus philomelos)',
        id: 129,
        scientificSpeciesName: 'Turdus philomelos'
    },
    {
        familyId: 60,
        name: 'Turtle Dove (Streptopelia turtur)',
        id: 130,
        scientificSpeciesName: 'Streptopelia turtur'
    }

]