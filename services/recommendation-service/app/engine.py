import math
import json
from typing import Dict, List, Any, Optional

# Seed Book Metadata for standalone fallback and fast vector math
SEED_BOOKS = {
    "book_dune": {
        "id": "book_dune",
        "title": "Dune",
        "author": "Frank Herbert",
        "genres": ["Science Fiction", "Space Opera", "Classics", "Adventure"],
        "cover_url": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80",
        "description": "Epic desert planetary ecology, spice trade, interstellar politics, and prophetic messianism.",
        "tags": {"sci_fi": 1.0, "space_opera": 0.9, "worldbuilding": 0.95, "politics": 0.8, "classics": 0.7}
    },
    "book_gone_girl": {
        "id": "book_gone_girl",
        "title": "Gone Girl",
        "author": "Gillian Flynn",
        "genres": ["Thriller", "Psychological Fiction", "Mystery", "Crime"],
        "cover_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "description": "Unreliable narrators, toxic marriage satire, dark deception, and psychological games.",
        "tags": {"thriller": 1.0, "psychological": 0.95, "dark": 0.9, "mystery": 0.85, "unreliable_narrator": 0.9}
    },
    "book_the_book_thief": {
        "id": "book_the_book_thief",
        "title": "The Book Thief",
        "author": "Markus Zusak",
        "genres": ["Historical Fiction", "Literary Fiction", "Classics"],
        "cover_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        "description": "Narrated by Death, WW2 Germany, empathy, stolen books, emotional literary beauty.",
        "tags": {"historical": 0.95, "literary": 0.9, "emotional": 0.95, "classics": 0.8, "war": 0.75}
    },
    "book_fellowship": {
        "id": "book_fellowship",
        "title": "The Fellowship of the Ring",
        "author": "J.R.R. Tolkien",
        "genres": ["Fantasy", "Adventure", "Classics", "Epic"],
        "cover_url": "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
        "description": "Middle-earth epic fantasy, the One Ring, mythopoeia, camaraderie, legendary lore.",
        "tags": {"fantasy": 1.0, "epic": 0.95, "worldbuilding": 0.95, "classics": 0.9, "adventure": 0.85}
    },
    "book_good_omens": {
        "id": "book_good_omens",
        "title": "Good Omens",
        "author": "Neil Gaiman & Terry Pratchett",
        "genres": ["Fantasy", "Humor", "Contemporary", "Magical Realism"],
        "cover_url": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        "description": "Apocalyptic satire, angel and demon friendship, witty British comedy, philosophical banter.",
        "tags": {"fantasy": 0.85, "humor": 1.0, "satire": 0.9, "contemporary": 0.7, "wit": 0.95}
    },
    "book_pride_prejudice": {
        "id": "book_pride_prejudice",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genres": ["Classics", "Romance", "Literary Fiction"],
        "cover_url": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
        "description": "Regency England social comedy, Darcy and Elizabeth, sparkling irony, timeless romantic banter.",
        "tags": {"classics": 1.0, "romance": 0.95, "literary": 0.85, "wit": 0.9, "historical": 0.8}
    },
    "book_station_eleven": {
        "id": "book_station_eleven",
        "title": "Station Eleven",
        "author": "Emily St. John Mandel",
        "genres": ["Dystopian", "Science Fiction", "Literary Fiction"],
        "cover_url": "https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=600&q=80",
        "description": "Post-flu civilization collapse, traveling Shakespeare troupe, art as survival, quiet lyricism.",
        "tags": {"dystopian": 0.9, "sci_fi": 0.75, "literary": 0.95, "art": 0.9, "emotional": 0.85}
    },
    "book_sharp_objects": {
        "id": "book_sharp_objects",
        "title": "Sharp Objects",
        "author": "Gillian Flynn",
        "genres": ["Thriller", "Psychological Fiction", "Mystery", "Crime"],
        "cover_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
        "description": "Southern gothic gloom, small town murder, trauma, mother-daughter darkness, psychological suspense.",
        "tags": {"thriller": 0.95, "psychological": 0.95, "dark": 1.0, "mystery": 0.85, "gothic": 0.8}
    },
    "book_midnight_library": {
        "id": "book_midnight_library",
        "title": "The Midnight Library",
        "author": "Matt Haig",
        "genres": ["Magical Realism", "Contemporary", "Fantasy", "Fiction"],
        "cover_url": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
        "description": "Parallel realities, unmade decisions, warm existential comfort, mental health exploration.",
        "tags": {"magical_realism": 0.95, "contemporary": 0.85, "emotional": 0.9, "philosophical": 0.8}
    },
    "book_god_small_things": {
        "id": "book_god_small_things",
        "title": "The God of Small Things",
        "author": "Arundhati Roy",
        "genres": ["Literary Fiction", "Indian Literature", "Classics"],
        "cover_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        "description": "Lush sensory prose, Ayemenem Kerala, family secrets, love laws, postcolonial memory.",
        "tags": {"literary": 1.0, "indian_literature": 1.0, "classics": 0.85, "emotional": 0.9}
    }
}

SEED_ADAPTATIONS = [
    {
        "id": "adp_dune_2021",
        "book_id": "book_dune",
        "title": "Dune (2021)",
        "type": "Movie",
        "director": "Denis Villeneuve",
        "release_year": 2021,
        "poster_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        "tags": {"sci_fi": 1.0, "space_opera": 0.9, "worldbuilding": 0.95, "cinematic": 1.0}
    },
    {
        "id": "adp_gone_girl_2014",
        "book_id": "book_gone_girl",
        "title": "Gone Girl (2014)",
        "type": "Movie",
        "director": "David Fincher",
        "release_year": 2014,
        "poster_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        "tags": {"thriller": 1.0, "psychological": 0.95, "dark": 0.9, "cinematic": 0.95}
    },
    {
        "id": "adp_station_eleven_2021",
        "book_id": "book_station_eleven",
        "title": "Station Eleven (2021)",
        "type": "Miniseries",
        "director": "Patrick Somerville",
        "release_year": 2021,
        "poster_url": "https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=600&q=80",
        "tags": {"dystopian": 0.9, "literary": 0.95, "art": 0.9, "cinematic": 0.9}
    },
    {
        "id": "adp_fellowship_2001",
        "book_id": "book_fellowship",
        "title": "The Lord of the Rings: The Fellowship of the Ring (2001)",
        "type": "Movie",
        "director": "Peter Jackson",
        "release_year": 2001,
        "poster_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        "tags": {"fantasy": 1.0, "epic": 0.95, "worldbuilding": 0.95, "cinematic": 1.0}
    },
    {
        "id": "adp_sharp_objects_2018",
        "book_id": "book_sharp_objects",
        "title": "Sharp Objects (2018)",
        "type": "Miniseries",
        "director": "Jean-Marc Vallée",
        "release_year": 2018,
        "poster_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
        "tags": {"thriller": 0.95, "psychological": 0.95, "dark": 1.0, "cinematic": 0.9}
    }
]

# Baseline Taste Profiles for demo users
DEMO_USER_PROFILES = {
    "user_elena_vance": {
        "user_id": "user_elena_vance",
        "display_name": "Elena Vance",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        "ratings": {"book_dune": 5, "book_station_eleven": 5, "book_fellowship": 4},
        "favorites": ["book_dune", "book_station_eleven"],
        "taste_vector": {
            "sci_fi": 0.98, "space_opera": 0.9, "worldbuilding": 0.95, "dystopian": 0.85,
            "literary": 0.8, "epic": 0.75, "fantasy": 0.65, "classics": 0.7
        }
    },
    "user_marcus_thorne": {
        "user_id": "user_marcus_thorne",
        "display_name": "Marcus Thorne",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        "ratings": {"book_gone_girl": 5, "book_sharp_objects": 5, "book_dune": 4},
        "favorites": ["book_gone_girl", "book_sharp_objects"],
        "taste_vector": {
            "thriller": 0.98, "psychological": 0.98, "dark": 0.95, "mystery": 0.9,
            "unreliable_narrator": 0.9, "politics": 0.6, "sci_fi": 0.5
        }
    },
    "user_aria_chen": {
        "user_id": "user_aria_chen",
        "display_name": "Aria Chen",
        "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
        "ratings": {"book_fellowship": 5, "book_good_omens": 5, "book_the_book_thief": 5, "book_dune": 5, "book_pride_prejudice": 4},
        "favorites": ["book_fellowship", "book_good_omens", "book_the_book_thief", "book_dune"],
        "taste_vector": {
            "fantasy": 0.98, "epic": 0.95, "worldbuilding": 0.95, "emotional": 0.9,
            "humor": 0.85, "literary": 0.85, "classics": 0.85, "sci_fi": 0.7
        }
    },
    "user_rohan_sharma": {
        "user_id": "user_rohan_sharma",
        "display_name": "Rohan Sharma",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        "ratings": {"book_god_small_things": 5, "book_the_book_thief": 5, "book_midnight_library": 4},
        "favorites": ["book_god_small_things"],
        "taste_vector": {
            "literary": 0.98, "indian_literature": 0.98, "emotional": 0.95, "magical_realism": 0.8,
            "classics": 0.8, "contemporary": 0.75
        }
    }
}

def cosine_similarity(v1: Dict[str, float], v2: Dict[str, float]) -> float:
    """Calculates cosine similarity between two feature vector dictionaries."""
    keys = set(v1.keys()) | set(v2.keys())
    if not keys:
        return 0.0

    dot_product = sum(v1.get(k, 0.0) * v2.get(k, 0.0) for k in keys)
    mag1 = math.sqrt(sum(v1.get(k, 0.0) ** 2 for k in keys))
    mag2 = math.sqrt(sum(v2.get(k, 0.0) ** 2 for k in keys))

    if mag1 == 0 or mag2 == 0:
        return 0.0

    return dot_product / (mag1 * mag2)

def build_user_vector_from_activity(ratings: Dict[str, int], favorites: List[str]) -> Dict[str, float]:
    """Dynamically recalculates user taste vector from ratings and favorites."""
    vector: Dict[str, float] = {}

    for book_id, rating in ratings.items():
        if book_id in SEED_BOOKS:
            weight = rating / 5.0  # normalize 1-5 to 0.2 - 1.0
            is_fav = 1.3 if book_id in favorites else 1.0
            for tag, val in SEED_BOOKS[book_id]["tags"].items():
                vector[tag] = vector.get(tag, 0.0) + (val * weight * is_fav)

    # Normalize max feature to 1.0
    if vector:
        max_val = max(vector.values())
        if max_val > 0:
            for k in vector:
                vector[k] = round(vector[k] / max_val, 3)

    return vector

def generate_recommendations(user_id: str, dynamic_ratings: Optional[Dict[str, int]] = None, dynamic_favs: Optional[List[str]] = None) -> Dict[str, Any]:
    """Generates explainable book and adaptation recommendations."""
    # Find user profile
    user_prof = DEMO_USER_PROFILES.get(user_id)
    ratings = dynamic_ratings or (user_prof["ratings"] if user_prof else {})
    favs = dynamic_favs or (user_prof["favorites"] if user_prof else [])

    if ratings or favs:
        taste_vector = build_user_vector_from_activity(ratings, favs)
    elif user_prof:
        taste_vector = user_prof["taste_vector"]
    else:
        # Generic exploratory baseline
        taste_vector = {"sci_fi": 0.8, "thriller": 0.7, "fantasy": 0.8, "literary": 0.7}

    read_book_ids = set(ratings.keys())

    # Rank unread books
    book_scores = []
    for book_id, book in SEED_BOOKS.items():
        if book_id in read_book_ids:
            continue
        sim = cosine_similarity(taste_vector, book["tags"])
        
        # Generate human-readable reason
        common_tags = sorted(
            [(k, taste_vector.get(k, 0) * book["tags"].get(k, 0)) for k in book["tags"] if k in taste_vector],
            key=lambda x: x[1],
            reverse=True
        )
        
        top_tag_name = common_tags[0][0].replace('_', ' ') if common_tags else 'storytelling'
        
        # Look for loved books that share traits
        loved_ref = None
        for r_id, r_val in ratings.items():
            if r_val >= 4 and r_id in SEED_BOOKS:
                loved_ref = SEED_BOOKS[r_id]["title"]
                break

        if loved_ref:
            reason = f"Because you loved {loved_ref} and highly appreciate {top_tag_name}."
        else:
            reason = f"Curated for your appetite for {top_tag_name} and immersive narratives."

        book_scores.append({
            "book": book,
            "similarity_score": round(sim, 3),
            "match_percentage": int(round(sim * 100)),
            "reason": reason
        })

    book_scores.sort(key=lambda x: x["similarity_score"], reverse=True)

    # Rank cross-media adaptations
    adaptation_scores = []
    for adp in SEED_ADAPTATIONS:
        sim = cosine_similarity(taste_vector, adp["tags"])
        
        source_book = SEED_BOOKS.get(adp["book_id"])
        source_title = source_book["title"] if source_book else "source novel"
        
        if adp["book_id"] in read_book_ids:
            reason = f"From page to screen — you read {source_title}, now discover {adp['director']}'s cinematic vision."
        else:
            reason = f"Cinematic cross-media match — visionary direction aligned with your narrative taste."

        adaptation_scores.append({
            "adaptation": adp,
            "similarity_score": round(sim, 3),
            "match_percentage": int(round(sim * 100)),
            "reason": reason
        })

    adaptation_scores.sort(key=lambda x: x["similarity_score"], reverse=True)

    return {
        "userId": user_id,
        "tasteVector": taste_vector,
        "bookRecommendations": book_scores[:6],
        "adaptationRecommendations": adaptation_scores[:4]
    }

def calculate_shelfmatch(current_user_id: str) -> List[Dict[str, Any]]:
    """Calculates taste match compatibility between current user and other community readers."""
    current_prof = DEMO_USER_PROFILES.get(current_user_id)
    if not current_prof:
        # Default to Elena if user is unknown
        current_prof = DEMO_USER_PROFILES["user_elena_vance"]

    v_curr = current_prof["taste_vector"]
    curr_ratings = current_prof["ratings"]
    curr_favs = set(current_prof["favorites"])

    matches = []

    for other_id, other_prof in DEMO_USER_PROFILES.items():
        if other_id == current_user_id:
            continue

        v_other = other_prof["taste_vector"]
        sim = cosine_similarity(v_curr, v_other)

        # Calculate shared high ratings (4 or 5 stars)
        other_ratings = other_prof["ratings"]
        shared_loved_ids = [
            b_id for b_id, r in curr_ratings.items()
            if r >= 4 and other_ratings.get(b_id, 0) >= 4 and b_id in SEED_BOOKS
        ]
        shared_books = [SEED_BOOKS[b_id] for b_id in shared_loved_ids]

        # Calculate books other reader loved that current user has NOT read yet
        discoveries_ids = [
            b_id for b_id, r in other_ratings.items()
            if r >= 4 and b_id not in curr_ratings and b_id in SEED_BOOKS
        ]
        unshared_discoveries = [SEED_BOOKS[b_id] for b_id in discoveries_ids]

        # Determine common genres
        shared_genres = set()
        for b in shared_books:
            shared_genres.update(b["genres"])
        if not shared_genres:
            shared_genres = {"Speculative Fiction", "Compelling Narrative"}

        # Compatibility score scaled 75% - 98% for realistic feel
        compat_percentage = int(min(98, max(68, round(sim * 100))))

        matches.append({
            "readerId": other_id,
            "displayName": other_prof["display_name"],
            "avatarUrl": other_prof["avatar_url"],
            "compatibilityPercentage": compat_percentage,
            "sharedBooksLoved": shared_books,
            "sharedGenres": list(shared_genres)[:4],
            "discoveriesFromReader": unshared_discoveries[:3]
        })

    matches.sort(key=lambda x: x["compatibilityPercentage"], reverse=True)
    return matches
