resize_canvas();
window.addEventListener('resize', resize_canvas);
let p1_selection = null;
let p2_selection = null;
function select_char(player_num, char_type) {
    if (player_num === 1) {
        p1_selection = char_type;
        document.getElementById("p1-status").innerText = "Selected: " + char_type.toUpperCase();
        document.getElementById("p1-select").style.borderColor = "#2ecc71";
    } else {
        p2_selection = char_type;
        document.getElementById("p2-status").innerText = "Selected: " + char_type.toUpperCase();
        document.getElementById("p2-select").style.borderColor = "#2ecc71";
    }
    if (p1_selection && p2_selection) {
        document.getElementById("start-btn").disabled = false;
        document.getElementById("start-btn").style.opacity = "1";
    }}

function start_game() {
    if (!p1_selection || !p2_selection) return;
    document.getElementById("char-select-screen").style.display = "none";
    document.getElementById("ui-layer").style.display = "flex";
    document.getElementById("story-btn").style.display = "none"; 
    game_logic(p1_selection, p2_selection);
    document.getElementById("p1-name").innerText = "P1: " + p1_selection.toUpperCase();
    document.getElementById("p2-name").innerText = "P2: " + p2_selection.toUpperCase();
    requestAnimationFrame(game_loop);
}

function view_story() {
    document.getElementById("story-btn").style.display = "none";
    setTimeout(() => {
        game_state.story_mode = true;
    }, 50);
}

window.addEventListener("click", function(e) {
    if (game_state.story_mode) {
         window.location.href = "index.html";                 
    }
});

function game_loop() {
    if (game_state.running && !game_state.story_mode) {
        update_controls(); 
        update_world();     
        render_game(); 
    } else if (game_state.story_mode) {
        render_story();
    }

    if (player_1 && player_2 && (player_1.dead || player_2.dead)) {
        if (!game_state.story_mode) {
            render_game();
            let story_btn = document.getElementById("story-btn");
            if (player_1.dead) {
                story_btn.innerText = "The world has been destroyed";
            } else {
                story_btn.innerText = "The world is saved";
            }
            document.getElementById("story-btn").style.display = "block";
        }} 
    requestAnimationFrame(game_loop);
}