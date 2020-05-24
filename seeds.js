const mongoose      = require("mongoose");
const Campground    = require("./models/campground");
const Comment       = require("./models/comment");


var seeds = [
    {
        name: "Cloud's Rest",
        image: "https://source.unsplash.com/y8Ngwq34_Ak/",
        description: "Siphon medium acerbic cup, mocha, galão strong blue mountain froth variety. Mug whipped white coffee blue mountain ristretto white. Galão and latte so robusta skinny doppio grinder. Extra, caramelization strong, pumpkin spice sit skinny flavour cultivar froth java instant. Sugar single shot, redeye, caffeine bar siphon affogato dripper. Java body in roast coffee, con panna acerbic mocha carajillo cappuccino. Blue mountain doppio cortado bar mocha extraction strong. Affogato so, aroma single origin seasonal café au lait aged robust shop decaffeinated. Americano, shop grinder aromatic, foam café au lait frappuccino, redeye grounds trifecta organic extra. Froth, java foam steamed, at kopi-luwak instant dark trifecta.",
        author: {
            id: "588c2e092403d111454fff76",
            username: "Jack"
        }

    },
    {
        name: "Canyon Floor'd",
        image: "https://source.unsplash.com/re2LZOB2XvY/",
        description: "I'm baby pug chambray vaporware tbh, dolor culpa direct trade twee messenger bag synth normcore gochujang organic et hexagon. Voluptate direct trade duis adipisicing iceland palo santo laboris raw denim pour-over slow-carb butcher deserunt microdosing flexitarian. Ea ennui locavore cred consectetur. Tote bag post-ironic snackwave, edison bulb aesthetic mollit excepteur tilde trust fund shaman sint fixie aliquip paleo artisan. Aliqua sustainable aute banh mi pickled church-key. Everyday carry edison bulb thundercats letterpress. Narwhal hexagon artisan, adipisicing pour-over pinterest mumblecore tilde actually veniam XOXO cliche 8-bit mlkshk hot chicken. Sint man bun ea ad master cleanse voluptate shoreditch. Whatever poutine pitchfork, shoreditch photo booth sustainable leggings forage. In ut retro direct trade non, normcore farm-to-table tbh blue bottle ennui. Kale chips migas dolor occupy, mixtape adipisicing authentic ennui freegan beard. Poutine listicle readymade jianbing, waistcoat voluptate fingerstache tattooed unicorn PBR&B synth tote bag franzen. Small batch tilde photo booth affogato cardigan exercitation hexagon pour-over kitsch stumptown adipisicing leggings live-edge cliche.",
        author: {
            id: "588c2e092403d111454fff77",
            username: "Jill"
        }
    },
    {
        name: "Sephiroth's Sunset",
        image: "https://source.unsplash.com/ebnlHkqfUHY/",
        description: "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic. Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini. Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke. ",
        author: {
            id: "588c2e092403d111454fff78",
            username: "Jane"
        }

    }
]


//this replaces the callBack hell from before
// also of note: the console.log calls can be deleted at some point
// *********************************************
async function seedDB(){
    try{
        await Comment.deleteMany({});
        await Campground.deleteMany({});
    
        for(const seed of seeds){
            let campground = await Campground.create(seed);
            let comment = await Comment.create(
                {
                    text: "This place is great, but I wish there was internet",
                    author: {
                        id: "5eb84620cdfb7e087c156cc6",
                        username: "Eamonn"
                    }
                }
            )
            campground.comments.push(comment);
            campground.save();
        }
    }catch(err){
        console.log(err);
    }
}


module.exports = seedDB;