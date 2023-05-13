"use strict";
const {Op}=require("sequelize")
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const groups = [
  { name: "San Francisco Mother's Group",
  organizerId:4,
  about:"In person gatherings for women raising the next generation. Open to single moms, married moms, mothers through adoption and fostering, from pregnancy through high school. Every mom is welcome here.",
  type:"inPerson",
  private:false,
  city:"San Francisco",
  state:"California",
  

},
{ name: "SF Gay Men's Poker Group",
organizerId:2,
about:"Hello. I have a bi-weekly Gay Men's Poker Group for 20+ years (All are welcome-we've had lesbians/straight guys play too) and we're looking for a few others to join us.",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",

},
{ name: "Boba Buddies SF🧋",
organizerId:1,
about:"Are you a fan of boba and wholesome fun? Let's meet up and grab boba together! Growing up in SF I would always go to various boba places in the city and play boardgames with my friends. It was always very fun, and helped flourish a lot of my current friendships. I’m hoping to recreate that same feeling with this group! I'd love to get together to possibly meet at boba place every other week while meeting new people!",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",
},


{ name: "Golden Gate Lovers",
organizerId:1,
about:"Welcome to the Golden Gate Bridge Lovers Community, a group of individuals united by our shared passion for this iconic landmark! Whether you're a San Francisco native, a frequent visitor to the area, or simply someone who appreciates the beauty and engineering marvels of the world, we invite you to join our community and explore all that the Golden Gate Bridge has to offer. Our group is a place to exchange stories, share experiences, and learn more about the history, construction, and cultural significance of the bridge. We organize events and activities such as photo walks, bike rides, and historical lectures, and welcome all who share our love for the Golden Gate Bridge. Join us today and discover why this world-famous landmark continues to capture the hearts and minds of people around the globe.",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",
},

{ name: "Bay Area Hikers",
organizerId:1,
about:"Welcome to the Hiking Community, a group of individuals who share a passion for exploring the great outdoors on foot! Our community is a place to connect with fellow hikers, share experiences, and discover new trails and destinations. Whether you're a seasoned trekker or new to the world of hiking, our group offers something for everyone. We organize hikes of all levels, from easy walks to challenging mountain summits, and welcome all who love to spend time in nature and embrace the beauty of the great outdoors. Our group is also a place to exchange tips, advice, and stories about hiking gear, safety, and best practices. Join us today and start your journey to discovering the beauty and serenity of the natural world, one step at a time!",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",
},
{ name: "Game of Thrones Fans",
organizerId:1,
about:"Welcome to the Game of Thrones Fan Community, a group for lovers of the epic world of Westeros and beyond! Whether you're a book reader, TV show enthusiast, or just a fan of fantasy and adventure, our community is the place to connect with fellow fans, share experiences, and discuss the intricate plots, memorable characters, and breathtaking landscapes of the Seven Kingdoms. Join us for watch parties, trivia nights, and cosplay gatherings, and become part of the epic journey that has captivated millions of fans around the world!",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",
},

];
/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert("People", [{
     *   name: "John Doe",
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = "Groups";
    return queryInterface.bulkInsert(options,
        groups,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    options.tableName = "Groups";
    return queryInterface.bulkDelete(options, {[Op.or]:groups},{});
  }
};
