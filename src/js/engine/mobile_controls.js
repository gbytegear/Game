ge.loop.insertBackFunction(() => {
	if(!movement_joystick.value.touched)return;
	let add = [
	  movement_joystick.value.x * ge.player.stats.movement_speed,
	  movement_joystick.value.y * ge.player.stats.movement_speed
	];
	//DEBUG THIS↓
	ge.map.position = [
        ge.map.position[0] + (ge.map.hitSolid({
            x: -ge.map.position[0] - add[0] - 20,
            y: -ge.map.position[1] - 20,
            width: 40,
            height: 40,
        })
        ?0
        :add[0]),

        ge.map.position[1] + (ge.map.hitSolid({
            x: -ge.map.position[0] - 20,
            y: -ge.map.position[1] - add[1] - 20,
            width: 40,
            height: 40,
        })
        ?0
        :add[1])
    ];
});
