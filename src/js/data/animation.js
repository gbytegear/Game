localStorage.setItem('animations', JSON.stringify({
    noweapon: [{
      head: { angle: 0 },
      body: { angle: 0 },
      handL1: { angle: -20, visible: 'false' },
      handL2: { angle: 60 },
      handR1: { angle: 30, visible: 'false' },
      handR2: { angle: -90 },
    }],
    rifle: [{
      head: { angle: -45 },
      body: { angle: 45 },
      handL1: { angle: -15, visible: 'true' },
      handL2: { angle: 50 },
      handR1: { angle: 20, visible: 'true' },
      handR2: { angle: -100 },
      weapon: { angle: 38 }
    }],
  }));