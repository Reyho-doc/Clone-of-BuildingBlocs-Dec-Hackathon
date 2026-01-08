let keys = {};
window.addEventListener("keydown", e => {return keys[e.key] = true;} );
window.addEventListener("keyup",   e => {return keys[e.key] = false;} );

function update_player(player) {
    if (player.dead) return;
    if (player.id == "player1") {
        if (keys["a"]) { player.vx -= player.speed; player.facing = -1;}
        if (keys["d"]) { player.vx += player.speed; player.facing = 1;}
        if (keys["w"] && player.jumps > 0){
            player.vy = -player.jump_force;
            player.jumps--;
            keys["w"] = false; 
        }
        if (keys["f"]) fire_projectile(player);
        if (keys["s"]) {
            player.blocking = true;
            player.shield_val -= player.shield_decay;}
        else {
            player.blocking = false;
            player.shield_val += player.shield_regen;}
    }
    if (player.id == "player2") {
        if (keys["j"] || keys["ArrowLeft"])  { player.vx -= player.speed; player.facing = -1;}
        if (keys["l"] || keys["ArrowRight"]) { player.vx += player.speed; player.facing = 1;}
        if ((keys["i"] || keys["ArrowUp"]) && player.jumps > 0){
            player.vy = -player.jump_force;
            player.jumps--;
            keys["i"] = false; keys["ArrowUp"] = false;
        }
        if (keys["h"]) fire_projectile(player);
        if (keys["k"] || keys["ArrowDown"]){
            player.blocking = true;
            player.shield_val -= player.shield_decay;}
        else {
            player.blocking = false;
            player.shield_val += player.shield_regen;}
    }

    if (player.shield_val < 0){
         player.shield_val = 0;
    }
    if (player.shield_val > player.max_shield){
        player.shield_val = player.max_shield;
    }

    player.vx *= world.friction;
    player.vy += world.gravity_force;                        //AI generated velocity Physics
    if (player.vx > player.max_speed) player.vx = player.max_speed;
    if (player.vx < -player.max_speed) player.vx = -player.max_speed;
    player.x += player.vx;
    let on_ground = platform_collision(player);
    
    if (!on_ground) {
        player.y += player.vy;
    } else {
        if(player.vy >= 0) player.jumps = player.max_jumps;
    }
    if (player.x < 0) { player.x = 0; player.vx = 0; }
    if (player.x + player_width > world.width){
        player.x = world.width - player_width;
        player.vx = 0;
    }
    if (player.y > world.height) { 
        player.hp = 0;
        player.dead = true;
    }}                                                      //End of AI gen code

function update_controls() {
    update_player(player_1);
    update_player(player_2);

    if (player_1.ranged_cooldown > 0){
        player_1.ranged_cooldown--;
    }
    if (player_2.ranged_cooldown > 0){
         player_2.ranged_cooldown--;
    }}                                              