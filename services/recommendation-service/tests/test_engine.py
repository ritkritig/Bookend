import unittest
import sys
import os

# Ensure recommendation-service directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.engine import (
    cosine_similarity,
    build_user_vector_from_activity,
    generate_recommendations,
    calculate_shelfmatch,
    SEED_BOOKS
)

class TestRecommendationEngine(unittest.TestCase):
    def test_cosine_similarity_identical(self):
        v1 = {"sci_fi": 1.0, "space": 0.8}
        v2 = {"sci_fi": 1.0, "space": 0.8}
        sim = cosine_similarity(v1, v2)
        self.assertAlmostEqual(sim, 1.0, places=4)

    def test_cosine_similarity_orthogonal(self):
        v1 = {"sci_fi": 1.0}
        v2 = {"romance": 1.0}
        sim = cosine_similarity(v1, v2)
        self.assertEqual(sim, 0.0)

    def test_user_vector_recalculation(self):
        ratings = {"book_dune": 5}
        favs = ["book_dune"]
        vector = build_user_vector_from_activity(ratings, favs)
        self.assertIn("sci_fi", vector)
        self.assertIn("space_opera", vector)
        self.assertGreater(vector["sci_fi"], 0.5)

    def test_generate_recommendations_has_explainability(self):
        res = generate_recommendations("user_elena_vance")
        self.assertIn("bookRecommendations", res)
        self.assertIn("adaptationRecommendations", res)
        recs = res["bookRecommendations"]
        self.assertGreater(len(recs), 0)
        first = recs[0]
        self.assertIn("reason", first)
        self.assertTrue(len(first["reason"]) > 10)
        self.assertIn("similarity_score", first)

    def test_shelfmatch_calculation(self):
        matches = calculate_shelfmatch("user_elena_vance")
        self.assertGreater(len(matches), 0)
        first_match = matches[0]
        self.assertIn("compatibilityPercentage", first_match)
        self.assertGreater(first_match["compatibilityPercentage"], 50)
        self.assertIn("sharedBooksLoved", first_match)
        self.assertIn("discoveriesFromReader", first_match)

if __name__ == "__main__":
    unittest.main()
