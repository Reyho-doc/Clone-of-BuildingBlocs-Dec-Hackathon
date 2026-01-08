const sprite_images = {
    thor_idle: new Image(),
    thor_block: new Image(),
    cap_idle: new Image(),
    cap_block: new Image(),
    iron_idle: new Image(),
    iron_jump: new Image(),
    thanos_idle: new Image(),
};
sprite_images.thor_idle.src = "Untitled_1.png";
sprite_images.thor_block.src = "Thor_blocking-removebg-preview.png";
sprite_images.cap_idle.src = "Adobe_Express_-_file.png";
sprite_images.cap_block.src = "Adobe_Express_-_file_1.png";
sprite_images.iron_idle.src = "Ironman_normal-Picsart-BackgroundRemover.png";
sprite_images.iron_jump.src = "Ironman_Jumping-Picsart-BackgroundRemover.png";
sprite_images.thanos_idle.src = "Thanos-removebg-preview.png";


const canvas = document.getElementById("game-canvas");
const c = canvas.getContext("2d");

function resize_canvas() {
    canvas.width = 800;
    canvas.height = 800;

    let scale = Math.min(window.innerWidth / 800, window.innerHeight / 800);
    canvas.style.width = (800 * scale) + "px";
    canvas.style.height = (800 * scale) + "px";
}

function get_sprite(player) {
    const type = player.type;

    if (type === "thor") {
        if (player.blocking && player.shield_val > 0) return sprite_images.thor_block;
        return sprite_images.thor_idle;
    }

    if (type === "cap") {
        if (player.blocking && player.shield_val > 0) return sprite_images.cap_block;
        return sprite_images.cap_idle;
    }

    if (type === "ironman") {
        if (Math.abs(player.vy) > 2) return sprite_images.iron_jump;
        return sprite_images.iron_idle;
    }

    if (type === "thanos") {
        return sprite_images.thanos_idle;
    }
    return null;
}

function draw_player(p) {
    const sprite = get_sprite(p);
    const w = 40;
    const h = 40;

    if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
        c.save();
        if (p.facing === -1) {
            c.translate(p.x + w, p.y);
            c.scale(-1, 1);
            c.drawImage(sprite, 0, 0, w, h);
        } else {
            c.drawImage(sprite, p.x, p.y, w, h);
        }
        c.restore();
    } 

    if (p.blocking && p.shield_val > 0 && !p.dead) {
        c.strokeStyle = "cyan";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(p.x + w/2, p.y + h/2, 30, 0, Math.PI*2);
        c.stroke();
    }}

function render_game() {
    c.fillStyle = "#202020";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = "#555";
    c.strokeStyle = "#777";
    for (let p of platforms) {
        c.fillRect(p.x, p.y, p.w, p.h);
        c.strokeRect(p.x, p.y, p.w, p.h);
    }
    if (player_1 && !player_1.dead) draw_player(player_1);
    if (player_2 && !player_2.dead) draw_player(player_2);

    c.fillStyle = "yellow";
    for (let pr of projectiles) {
        c.fillRect(pr.x, pr.y, pr.w || 8, pr.h || 8);
    }
    
    if (player_1 && player_2) {
        document.getElementById("p1-health").innerText = "HP: " + Math.floor(player_1.hp);
        document.getElementById("p1-shield").innerText = "Shield: " + Math.floor(player_1.shield_val);
        document.getElementById("p2-health").innerText = "HP: " + Math.floor(player_2.hp);
        document.getElementById("p2-shield").innerText = "Shield: " + Math.floor(player_2.shield_val);
        document.getElementById("p1-hp-bar").style.width = Math.max(0, (player_1.hp / 100) * 100) + "%";
        document.getElementById("p2-hp-bar").style.width = Math.max(0, (player_2.hp / 100) * 100) + "%";

        if (player_1.dead || player_2.dead) {
            c.fillStyle = "rgba(1, 1, 1, 0.56)";
            c.fillRect(0,0,canvas.width,canvas.height);
            c.fillStyle = "white";
            c.font = "40px Arial";
            c.textAlign = "center";

            let msg = player_1.dead ? "The world has been destroyed!": "The world is saved!";
            c.fillText(msg, canvas.width/2, canvas.height/2 - 20);
            
            c.font = "20px Arial";
            c.fillText("Refresh to restart", canvas.width/2, canvas.height/2 + 20);
        }}}

function render_story() {
    c.fillStyle = "#1a1a1a";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#333";
    c.fillRect(0, 600, 800, 200);

    let winner = game_state.winner;
    let loser = game_state.loser;

    if (winner && loser) {
        c.fillStyle = "#a09d03ff";
        c.textAlign = "center";
        c.fillText("Click to continue", canvas.width/2, 140);
        c.fillText(winner.type.toUpperCase() + " stands victoriously over " + loser.type.toUpperCase(), canvas.width/2, 750);
        let w_display = { ...winner, x: 300, y: 560, facing: 1, blocking: false, dead: false, vy: 0 };
        c.save();
        c.translate(300, 560);
        c.scale(2, 2); 
        c.translate(-300, -560);
        draw_player(w_display);
        c.restore();
        let l_display = { ...loser, x: 500, y: 580, facing: -1, blocking: false, dead: false, vy: 0 };
        const sprite = get_sprite(l_display);
        c.save();
        c.translate(l_display.x + 20, l_display.y + 20); 
        c.rotate(Math.PI / 2);
        c.scale(2, 2); 
        if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
            c.drawImage(sprite, -20, -20, 40, 40);
        }
        c.restore();
    }}