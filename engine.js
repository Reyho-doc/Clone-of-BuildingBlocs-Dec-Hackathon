let game_state = {
    running: false,
    winner: null,
    loser: null,
    story_mode: false
};

function world_stats(width, height, gravity_force){
    return {
        width: width,
        height: height,
        gravity_force: gravity_force,
        friction: 0.9
    };
}

const player_width = 40;
const player_height = 40;
const platforms = [
    { x: 100, y: 550, w: 200, h: 20 },
    { x: 500, y: 550, w: 200, h: 20 },
    { x: 300, y: 350, w: 200, h: 20 },
    { x: 0,   y: 700, w: 800, h: 100 }];
let player_1 = null;
let player_2 = null;

function create_player(id, type, start_x, start_y, facing) {
    let base = {
        id: id,
        type: type,
        x: start_x,
        y: start_y,
        vx: 0,
        vy: 0,
        facing: facing,
        speed: 1,
        max_speed: 4,
        jump_force: 22,
        jumps: 0,
        max_jumps: 2,
        blocking: false,
        shield_val: 100,
        max_shield: 100,
        shield_decay: 1.0,   
        shield_regen: 0.3,     
        hp: 80,
        dead: false,
        ranged_cooldown: 0,
        max_cooldown: 40
    };
    if (type === "thor") {
        base.hp = 100;
        base.max_speed = 7;
    } else if (type === "ironman") {
        base.max_speed = 7;
        base.speed = 1.4,
        base.max_jumps = 3; 
        base.hp = 70;
    } else if (type === "cap") {
        base.max_speed = 7;
        base.shield_regen = 0.6;
    } else if (type === "thanos") {
        base.hp = 100;
        base.max_speed = 6;
        base.shield_decay = 0.8;
    }
    return base;
}

let world = world_stats(800, 800, 0.8);

function game_logic(player1type, player2type){
    player_1 = create_player("player1", player1type, 100, 660, 1);
    player_2 = create_player("player2", player2type, 600, 660, -1);
    projectiles = [];
    game_state.running = true;
    game_state.story_mode = false;
    game_state.winner = null;
    game_state.loser = null;
}

let projectiles = [];
function fire_projectile(player){
    let proj_name = (player.id == "player1") ? "projectile1" : "projectile2";
    if (player.ranged_cooldown > 0) return;
    if (player.dead) return;

    projectiles.push({
        type: proj_name,
        owner: player.id,       
        x: player.x + player_width / 2,
        y: player.y + player_height / 2,
        direction: player.facing,
        speed: 10,
        damage: 10,
        w: 8,
        h: 8
    });
    player.ranged_cooldown = player.max_cooldown;
}

function platform_collision(p){
    let on_ground = false;
    for (let plat of platforms) {
        if (p.x + player_width > plat.x && p.x < plat.x + plat.w) {
            if (p.y + player_height <= plat.y && 
                p.y + player_height + p.vy >= plat.y) {
                
                p.vy = 0;
                p.y = plat.y - player_height;
                on_ground = true;
            }}}
    return on_ground;
}

function update_world(){
    for (let i = projectiles.length - 1; i >= 0; i--){
        let pr = projectiles[i];
        pr.x += pr.speed * pr.direction;
        if (pr.x < 0 || pr.x > world.width){
            projectiles.splice(i, 1);
            continue;
        }
        function hits(player){
            if (player.dead) return false;
            let hit_x = pr.x > player.x && pr.x < player.x + player_width;
            let hit_y = pr.y > player.y && pr.y < player.y + player_height;

            if (hit_x && hit_y) {
                let final_damage = pr.damage;
                if (player.blocking && player.shield_val > 0) {
                    let mitigation = player.shield_val / player.max_shield;
                    final_damage = pr.damage * (1 - mitigation);
                }
                player.hp -= final_damage;

                projectiles.splice(i, 1);
                return true;}
            return false;
        }
        if (pr.owner === "player1") {
            if (hits(player_2)) 
            {continue;
        }} else {
            if (hits(player_1))
            {continue;
        }}
        
        if (player_1.hp <= 0 && !player_1.dead) {
             player_1.hp = 0;
             player_1.dead = true;
             game_state.winner = player_2;
             game_state.loser = player_1;
        }

        if (player_2.hp <= 0 && !player_2.dead) {
            player_2.hp = 0;
            player_2.dead = true;
            game_state.winner = player_1;
            game_state.loser = player_2;
        }}}