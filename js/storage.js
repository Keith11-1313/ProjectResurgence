// ============================================================
// PROJECT RESURGENCE: THE SILENT ZONE — Storage (Save/Load)
// ============================================================

const Storage = {
    SAVE_KEY: "project_resurgence_save",

    saveGame(state) {
        try {
            const serialized = JSON.stringify(state);
            localStorage.setItem(this.SAVE_KEY, serialized);
            return true;
        } catch (e) {
            console.error("Save failed:", e);
            return false;
        }
    },

    loadGame() {
        try {
            const serialized = localStorage.getItem(this.SAVE_KEY);
            if (!serialized) return null;
            return JSON.parse(serialized);
        } catch (e) {
            console.error("Load failed:", e);
            return null;
        }
    },

    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }
};
