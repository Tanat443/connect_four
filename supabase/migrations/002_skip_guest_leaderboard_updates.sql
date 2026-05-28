-- 002_skip_guest_leaderboard_updates.sql
-- Prevent guest match summaries from creating invalid leaderboard rows.

CREATE OR REPLACE FUNCTION update_leaderboard_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.player_1_id IS NULL THEN
        RETURN NEW;
    END IF;

    INSERT INTO leaderboards (user_id, matches_played, wins_bot, wins_online, updated_at)
    VALUES (
        NEW.player_1_id,
        1,
        CASE WHEN NEW.game_mode = 'bot' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END,
        CASE WHEN NEW.game_mode = 'online' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        matches_played = leaderboards.matches_played + 1,
        wins_bot = leaderboards.wins_bot + (CASE WHEN NEW.game_mode = 'bot' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END),
        wins_online = leaderboards.wins_online + (CASE WHEN NEW.game_mode = 'online' AND NEW.winner_id = NEW.player_1_id THEN 1 ELSE 0 END),
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
