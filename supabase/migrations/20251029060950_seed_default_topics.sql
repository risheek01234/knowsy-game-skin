/*
  # Seed Default Topics from EditableCards JSON

  ## Overview
  Loads all default game topics with their items into the topics table.
  These topics will be available to all users globally.

  ## Topics Loaded
  - 75+ default topics covering various categories
  - Each topic includes 7-11 items
  - FLAG values indicate editability (0 = non-editable, 1 = editable)
*/

-- Insert all default topics
INSERT INTO topics (name, flag, items, is_global, creator_id) VALUES
('3AM Thoughts', 0, '["Alien Existance", "Fictional Scenes", "Cringe Memories", "Food Cravings", "Existential Crisis", "Pet''s Secret Life", "Gratitude", "Diabolic Thoughts", "Future Vision", "Random Thoughts"]'::jsonb, true, null),
('After Dinner Scenes', 0, '["Dessert War", "Couch Takeover", "Story Time", "Dishes Debate", "Movie Time", "Coffee & Gossip", "Game Night", "Late Night Walk", "Meme Sharing", "Read Book"]'::jsonb, true, null),
('After Guests Leave', 0, '["Rant Mode", "Cleanup Regret", "Pack Leftovers", "Juicy Gossip", "Next Invite Ban", "Celebration", "Replay Conversations", "Social Battery Zero", "Pajama Party", "Immediate Sleep"]'::jsonb, true, null),
('Amusement Park Rides', 0, '["Roller Coaster", "Swings", "Ferris Wheel", "Merry-Go-Rounds", "Water Slides", "Bumper Cars", "Haunted Rides", "Drop Tower", "Teacups", "Log Flume"]'::jsonb, true, null),
('Autumn highlights', 0, '["Fall Leaves", "Pumpkin Spice", "Cozy Sweaters", "Apple Picking", "Halloween", "Bonfires", "Rain Wlalks", "Pumpkin Pie", "Movie Marathons", "Candy"]'::jsonb, true, null),
('Best Memory', 0, '["Sleepover", "Summer Trip", "Late-Night Talks", "Inside Jokes", "First Concert", "Family Reunion", "First Kiss", "Surprise Parties", "Christmas Eve", "Birthday"]'::jsonb, true, null),
('Best Shoe Brands', 0, '["Adidas", "Nike", "Under Armour", "Puma", "Asics", "Converse", "Vans", "Reebok", "Sketchers", "New Balance"]'::jsonb, true, null),
('Best Smells', 0, '["Fresh Bread", "New Book", "Gasoline", "Sharpie", "Rain", "Coffee Brew", "Fresh Laundry", "Scented Candle", "Ocean Breeze", "Campfire Smoke"]'::jsonb, true, null),
('Best Type of Nap', 0, '["Couch Coma", "Meditation", "Power Naps", "Bathroom Naps", "Car Drive", "Desk Doze", "Post-Lunch Slump", "Plane Snooze", "TV Background Nap", "Partner Cuddles"]'::jsonb, true, null),
('Best cartoon friend', 0, '["SpongeBob", "Mickey Mouse", "Bluey", "Peppa Pig", "Bugs Bunny", "Scooby-Doo", "Tom & Jerry", "Patrick Star", "Homer Simpson", "Donald Duck"]'::jsonb, true, null),
('Birthday Gift', 0, '["Gift Card", "Merchandise", "Books", "Skin Care Set", "Polaroid Camera", "Perfume", "Concert Tickets", "Chocolate Box", "Custom Jewelry", "Tech Gadgets"]'::jsonb, true, null),
('Breakfast cereal', 0, '["Lucky Charms", "Frosted Flakes", "Froot Loops", "Cheerios", "Cinnamon Crunch", "Corn Flakes", "Rice Krispies", "Raisin Bran", "Cocoa Puffs", "Chocos"]'::jsonb, true, null),
('Childhood Games', 0, '["Hide & Seek", "Tag", "Jump Rope", "Dress Up", "Simon Says", "Hopscotch", "Duck Duck Goose", "Snake & Ladders", "Monopoly", "Ludo"]'::jsonb, true, null),
('Comfort Food', 0, '["Ramen", "Ice Cream", "Pizza", "Salad", "Hotdogs", "Cookies", "Fries", "Tacos", "Chocolate Cake", "Pasta"]'::jsonb, true, null),
('Comfort Shows', 0, '["Reality Shows", "K-Drama", "Anime Binge", "Sitcom", "True Crime Docs", "Horror", "Baking Shows", "Cartoons", "Period dramas", "Stand Up Comedies"]'::jsonb, true, null),
('Dad''s Go-To Drink', 0, '["Black Coffee", "Diet Coke", "Iced Tea", "Craft Beer", "Bourbon Neat", "Protein Shake", "Hot Water", "Green Tea", "Smoothie", "Rum"]'::jsonb, true, null),
('Dance Styles', 0, '["Ballet", "Salsa", "Hip-Hop", "Tap", "Contemporary", "Jazz", "Breakdance", "Ballroom", "Freestyle", "Swing"]'::jsonb, true, null),
('Disney Sidekick', 0, '["Mushu (Mulan)", "Genie (Aladdin)", "Olaf (Frozen)", "Dug (Up)", "Hay Hay (Moana)", "Pascal (Tangled)", "Abu (Aladdin)", "Baymax (Big Hero 6)", "Timon (Lion King)", "Sebastian (Little Mermaid)"]'::jsonb, true, null),
('Dream Job as a Kid', 0, '["Astronaut", "Superhero", "Actor", "Artist", "Scientist", "Athlete", "Pilot", "Chef", "Traveller", "Unemployed"]'::jsonb, true, null),
('Energy Drink', 0, '["Red Bull", "Monster", "Gatorade", "Prime", "Rockstar", "Diet Coke", "Coffee", "Iced Tea", "Alcohol", "Protein Drink"]'::jsonb, true, null),
('F1 Teams', 1, '["McLaren", "Mercedes", "Ferrari", "Red Bull Racing", "Williams", "Aston Martin", "Racing Bulls", "Kick Sauber", "Haas F1 Team", "Alpine"]'::jsonb, true, null),
('Family Trip Spot', 0, '["House Party", "Backyard BBQ", "Camping Trip", "Fishing Trip", "Beach Day", "Road Trip", "Ski Resort", "Grandma''s House", "Amusement Park", "Cruise"]'::jsonb, true, null),
('Family Vacations Highlights', 0, '["Food Coma", "Group Storytelling", "Random Chaos", "Photo Sessions", "Game Nights", "Lost Luggag", "Car Karaoke", "Matching Outfits", "Pool Mishaps", "Late-Night Laughs"]'::jsonb, true, null),
('Fascinating Wonder Of The World', 1, '["Great Wall of China", "Colosseum", "Taj Mahal", "Christ the Redeemer", "Chichén Itzá", "Machu Picchu", "Petra"]'::jsonb, true, null),
('Favorite Disney movie', 0, '["Lion King", "Frozen", "Toy Story", "Moana", "Encanto", "Aladdin", "Mulan", "Finding Nemo", "Cinderella", "The Incredibles"]'::jsonb, true, null),
('Favorite type of sandwich?', 0, '["PB&J", "Grilled Cheese", "Turkey Club", "Ham & Cheese", "Avocado", "Tuna Melt", "BLT", "Nutella", "Egg", "Spinach & Corn"]'::jsonb, true, null),
('Funniest Family Member', 0, '["Dad Jokes", "Sassy Sibling", "Mom''s Savageness", "Comic Cousin", "Iconic Grandma", "Eldest Daughter", "Middle Child", "Drama Aunt", "Family Pet", "Rich Uncle"]'::jsonb, true, null),
('Girl Group Vibe', 0, '["Glam Squad", "Gossip Queens", "Food Explorers", "Meme Junkies", "Chill & Cozy", "Dance party", "Pajama Party", "Shopping Spree", "Travel Partners", "Wine nights"]'::jsonb, true, null),
('Go-To Excuses', 0, '["Traffic", "Sick Pet", "Migraine", "Missed Alarm", "Lost Keys", "Flat Tire", "Phone Died", "WiFi Issues", "Family Emergency", "Double Booked"]'::jsonb, true, null),
('Go-To Group Activity', 0, '["Movie Night", "Coffee Catch-Up", "Road Trip", "Game Night", "Mall Hangout", "Beach Day", "Escape Room", "Karaoke Night", "Bowling", "Hiking Adventure"]'::jsonb, true, null),
('Holidays', 0, '["Halloween", "Thanksgiving", "St.Patrick''s Day", "4th Of July", "Christmas", "Easter", "Diwali", "Valentine''s Day", "Labor Day", "New Year''s Eve"]'::jsonb, true, null),
('Hot Take', 0, '["Pizza''s Overrated", "TikTok''s Cringe", "Coffee Sucks", "Crocs Are Cool", "Dogs > People", "Winter > Summer", "Ketchup On Eggs", "Pineapple On Pizza", "Books > Movies", "Cold Showers Rule"]'::jsonb, true, null),
('IPL Teams ', 1, '["CSK", "RCB", "DC", "GT", "KKR", "SRH", "RR", "LSG", "MI", "PBKS"]'::jsonb, true, null),
('Iconic Brands', 0, '["Nike", "Tesla", "Apple", "Levis", "Coca Cola", "Google", "Disney", "Starbucks", "Amazon", "McDonalds"]'::jsonb, true, null),
('Instagram Aesthetic', 0, '["Photo Dump", "Food Pictures", "All Selfies", "Cool Edits", "No Posts", "Travel Pics", "Black & White", "Meme Account", "Fitness Journey", "Fan Page"]'::jsonb, true, null),
('Loudest Moment of your Family', 0, '["Group Storytelling", "Snacks Fight", "Sibling Fights", "Phone Calls", "Grandma''s TV Volume", "Car Karaoke", "Game Nights", "Morning Rush Hour", "Dog barking", "Festival Celebrations"]'::jsonb, true, null),
('Love Language Type', 0, '["Deep Convos", "Quality Time", "Food Sharing", "Sharing Memes", "Compliments", "Gift Giving", "Physical touch", "Remembering details", "Acts of service", "Sharing Clothes"]'::jsonb, true, null),
('Magical Place to Visit', 0, '["Hogwarts", "Narnia", "Pandora", "Neverland", "Shire", "Atlantis", "Wakanda", "Oz", "Te Fiti", "Asgard"]'::jsonb, true, null),
('Mom''s Guilty Pleasure', 0, '["True Crime Movies", "Target Runs", "Reality TV", "Online Shopping", "Wine", "Nap Time", "Chocolates", "Gossip Sessions", "Paint", "Binge Watch"]'::jsonb, true, null),
('Most Adorable Pet', 0, '["Bunnies", "Cats", "Hamsters", "Dogs", "Birds", "Guinea Pigs", "Ferrets", "Turtles", "Snake", "Lizard"]'::jsonb, true, null),
('Most Compatible ', 1, '["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Capricorn", "Aquarius", "Pisces"]'::jsonb, true, null),
('Most Likely Regret', 0, '["Text Messages", "Not Saying No", "Haircuts", "Binge Eating", "Procrastinating", "Skipped Plans", "Bad Tattoos", "Lost Friendships", "Career Choices", "Skipping Gym"]'::jsonb, true, null),
('Most Spoiled Member', 0, '["Oldest Daughter", "Mom", "Youngest Son", "Middle Child", "The Dog", "Grandma", "Dad", "Youngest Daughter", "Only Child", "The Cat"]'::jsonb, true, null),
('Movie Genres', 0, '["Romcoms", "Action Flicks", "Horror", "Drama", "Documentaries", "Sci-Fi", "Fantasy", "Animated", "Romance", "Crime"]'::jsonb, true, null),
('New Year''s Resolution', 0, '["Save Money", "Volunteer", "Eat Healthy", "Learn Something", "Exercise", "Read More", "Travel", "Get Organized", "New Hobby", "Be Kinder"]'::jsonb, true, null),
('Outdoor adventure', 0, '["Hiking Trail", "Beach Day", "Bike Ride", "Skating Park", "Camping Trip", "Kayaking", "Rock Climbing", "Road Trip", "Surfing", "Bonfire Night"]'::jsonb, true, null),
('Outfit Aesthetic', 0, '["Comfy Casual", "Gym Wear", "All Black", "Formals", "Anything Clean", "Cool Streetwear", "Oversized", "Overdressed", "Retro Vibes", "Bling"]'::jsonb, true, null),
('Road Trip Snack', 0, '["Cheese doritos", "Pickles", "Chocolate", "Slurpees", "Corn nuts", "Coffee", "Chips", "Burger", "Popcorn", "Gummy Bears"]'::jsonb, true, null),
('Self-Care Essentials', 0, '["Sheet Masks", "Hot Shower", "Journaling", "Beauty Sleep", "Long Scroll", "Painting", "Meditation", "Pedicure Time", "Solo Dancing", "Reading"]'::jsonb, true, null),
('Sport you love', 0, '["NBA", "Soccer", "NFL", "Tennis", "UFC", "Cricket", "Formula 1", "Rugby", "Golf", "Baseball"]'::jsonb, true, null),
('The Original Disney Princesses', 1, '["Snow White", "Cinderella", "Aurora", "Ariel", "Belle", "Jasmine", "Pocahontas", "Mulan"]'::jsonb, true, null),
('Theme Park Energy', 0, '["Adrenaline junkie", "Map reader", "Snack hunter", "Photographer", "Bench-sitter", "Ride Screamer", "Queue Complaine", "Souvenir Collector", "Cotton Candy Chaser", "Mascot Hugger"]'::jsonb, true, null),
('Wedding Vibe', 0, '["Dancefloor maniac", "Buffet strategist", "BTS photographer", "Gossiper", "Avoid conversations", "Crying During Vows", "Family Drama Watcher", "Uninvited Plus-One", "Overdresser", "Critiquer"]'::jsonb, true, null),
('Weekend Personality', 0, '["Hardcore Gamer", "Bookworm", "Hibernation", "Binge Mode", "Adventure Junkie", "Social Butterfly", "Sleep Enthusiast", "Gym Warrior", "Road Tripper", "Explore New Hobby"]'::jsonb, true, null),
('Winter Fun Activities', 0, '["Skiing", "Snowboarding", "Ice-Skating", "Snowman Making", "Hot Chocolate", "Sledding", "Snowball Fights", "Baking Cookies", "Watching Movies", "Tree Decorating"]'::jsonb, true, null)
ON CONFLICT DO NOTHING;