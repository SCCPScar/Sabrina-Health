// Biblioteca de exercícios da Nova Sabrina.
// Só em casa — sem equipamento de ginásio (no máximo: elástico, halteres
// leves, o próprio corpo, cadeira, parede). Pensada para pós-bariátrica:
// sem saltos, sem impacto forte nas articulações, progressão gradual.
import type { Exercise } from './types-training';

export const EXERCISES: Record<string, Exercise> = {
  // ---- Braços e ombros ----
  elevacao_lateral_leve: {
    id: 'elevacao_lateral_leve',
    name: 'Elevação Lateral com Halteres Leves',
    muscles: ['Ombros'],
    equipment: 'halteres leves',
    coreIntensity: 'nenhuma',
    desc: 'Sentada ou em pé, com um haltere leve (ou uma garrafa de água) em cada mão ao lado do corpo, eleva os braços para os lados até à altura dos ombros. Desce devagar.',
    tip: 'Cotovelos ligeiramente dobrados, sem pressa. Se sentires o ombro a queixar-se, reduz a amplitude.'
  },
  rosca_biceps_elastico: {
    id: 'rosca_biceps_elastico',
    name: 'Rosca de Bíceps com Elástico',
    muscles: ['Bíceps'],
    equipment: 'elástico',
    coreIntensity: 'nenhuma',
    desc: 'Pisa o elástico com um ou os dois pés e segura as pontas. Com os cotovelos junto ao corpo, dobra os braços trazendo as mãos aos ombros. Desce controlada.',
    tip: 'Sem elástico, usa garrafas de água. O importante é o movimento controlado, não o peso.'
  },
  extensao_triceps_cadeira: {
    id: 'extensao_triceps_cadeira',
    name: 'Extensão de Tríceps na Cadeira',
    muscles: ['Tríceps'],
    equipment: 'cadeira',
    coreIntensity: 'leve',
    desc: 'Senta-te na beira de uma cadeira firme, mãos apoiadas junto às ancas. Desliza o corpo levemente para a frente e dobra os cotovelos, descendo alguns centímetros. Empurra de volta.',
    tip: 'Não precisas de descer muito — mesmo uma amplitude pequena já trabalha bem o tríceps.'
  },
  flexao_parede: {
    id: 'flexao_parede',
    name: 'Flexão na Parede',
    muscles: ['Peito', 'Ombros', 'Tríceps'],
    equipment: 'parede',
    coreIntensity: 'leve',
    desc: 'De frente para uma parede, a cerca de um passo de distância, apoia as mãos na parede à largura dos ombros. Dobra os cotovelos aproximando o peito da parede, depois empurra de volta.',
    tip: 'Quanto mais afastada estiveres da parede, mais intenso fica — começa mais perto se for necessário.'
  },
  remada_elastico: {
    id: 'remada_elastico',
    name: 'Remada Sentada com Elástico',
    muscles: ['Costas', 'Bíceps'],
    equipment: 'elástico',
    coreIntensity: 'leve',
    desc: 'Sentada no chão ou numa cadeira, com as pernas esticadas à frente, prende o elástico à volta dos pés. Puxa as pontas em direção à cintura, apertando as omoplatas.',
    tip: 'Mantém as costas direitas — o movimento vem dos braços e das costas, não de te inclinares para trás.'
  },
  seated_row_elastico: {
    id: 'seated_row_elastico',
    name: 'Remada Aberta com Elástico',
    muscles: ['Costas', 'Ombro traseiro'],
    equipment: 'elástico',
    coreIntensity: 'leve',
    desc: 'Segura o elástico à frente do peito com os dois braços esticados. Abre os braços para os lados, apertando as omoplatas, e volta devagar.',
    tip: 'Ótimo para a postura — faz devagar e sente o aperto entre as omoplatas no fim do movimento.'
  },
  wall_angel: {
    id: 'wall_angel',
    name: 'Wall Angel (Anjo na Parede)',
    muscles: ['Ombros', 'Postura'],
    equipment: 'parede',
    coreIntensity: 'nenhuma',
    desc: 'Encosta as costas, cabeça e braços na parede, cotovelos a 90°. Desliza os braços para cima e para baixo pela parede, como se fizesses um anjo na neve, mantendo o contacto.',
    tip: 'Excelente para abrir o peito e aliviar tensão nos ombros — faz devagar e respira.'
  },
  overhead_press_leve: {
    id: 'overhead_press_leve',
    name: 'Elevação de Braços Acima da Cabeça',
    muscles: ['Ombros'],
    equipment: 'halteres leves',
    coreIntensity: 'nenhuma',
    desc: 'Sentada com as costas apoiadas, halteres leves (ou garrafas) ao nível dos ombros. Empurra os braços para cima até quase esticar, desce controlada.',
    tip: 'Se sentires desconforto no ombro, reduz a amplitude para não passar da altura da cabeça.'
  },
  shoulder_roll: {
    id: 'shoulder_roll',
    name: 'Rotação de Ombros',
    muscles: ['Ombros', 'Mobilidade'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Em pé ou sentada, roda os ombros lentamente para trás em círculos largos, depois inverte o sentido.',
    tip: 'Ótimo para aquecer no início do treino ou para aliviar tensão a qualquer altura do dia.'
  },

  // ---- Pernas e glúteos ----
  chair_squat: {
    id: 'chair_squat',
    name: 'Agachamento com Apoio na Cadeira',
    muscles: ['Quadríceps', 'Glúteos'],
    equipment: 'cadeira',
    coreIntensity: 'leve',
    desc: 'Em pé à frente de uma cadeira, pés à largura dos ombros. Desce como se fosses sentar, tocando levemente a cadeira com o rabo, e levanta de volta.',
    tip: 'A cadeira é a tua rede de segurança — se precisares, senta mesmo e levanta a partir daí.'
  },
  glute_bridge_suave: {
    id: 'glute_bridge_suave',
    name: 'Ponte de Glúteos',
    muscles: ['Glúteos', 'Posterior de coxa'],
    equipment: 'peso do corpo',
    coreIntensity: 'leve',
    desc: 'Deitada de costas, joelhos dobrados e pés apoiados no chão. Empurra os calcanhares e eleva as ancas devagar, aperta o glúteo no topo, desce controlada.',
    tip: 'Amplitude pequena e controlada é mais eficaz do que subir depressa e alto.'
  },
  wall_sit: {
    id: 'wall_sit',
    name: 'Cadeira na Parede (Wall Sit)',
    muscles: ['Quadríceps', 'Glúteos'],
    equipment: 'parede',
    coreIntensity: 'leve',
    desc: 'Encosta as costas na parede e desce como se fosses sentar numa cadeira invisível, joelhos a cerca de 90°. Mantém a posição a respirar normalmente.',
    tip: 'Começa com uma posição mais alta (menos dobrada) se for difícil — o objetivo é aguentar com boa forma, não sofrer.'
  },
  standing_leg_lift: {
    id: 'standing_leg_lift',
    name: 'Elevação de Perna Lateral (em pé)',
    muscles: ['Glúteo médio'],
    equipment: 'cadeira',
    coreIntensity: 'nenhuma',
    desc: 'Segura-te ao encosto de uma cadeira para equilíbrio. Eleva uma perna esticada para o lado, devagar, e desce controlada. Completa as repetições e troca de perna.',
    tip: 'Mantém o tronco direito — a tentação é inclinares-te para o lado, mas o movimento é só da perna.'
  },
  step_touch: {
    id: 'step_touch',
    name: 'Step Touch (Passo Lateral)',
    muscles: ['Pernas', 'Cardio leve'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Dá um passo lateral para um lado, junta o outro pé, depois repete para o outro lado — como um passo de dança suave, sem saltar.',
    tip: 'Ótimo para o coração sem impacto nas articulações. Podes balançar os braços para ajudar.'
  },
  calf_raise_casa: {
    id: 'calf_raise_casa',
    name: 'Elevação de Panturrilha',
    muscles: ['Gémeos'],
    equipment: 'cadeira',
    coreIntensity: 'nenhuma',
    desc: 'Em pé, apoiada no encosto de uma cadeira, eleva os calcanhares do chão ficando nas pontas dos pés. Mantém um segundo e desce controlada.',
    tip: 'Podes fazer sentada também, se preferires — eleva os calcanhares mantendo os dedos no chão.'
  },
  hip_circle: {
    id: 'hip_circle',
    name: 'Círculos de Anca',
    muscles: ['Anca', 'Mobilidade'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Em pé, mãos na cintura, faz círculos suaves com a anca, como um hula-hoop lento. Repete no sentido contrário.',
    tip: 'Movimento pequeno e confortável — serve para soltar a anca, não para forçar amplitude.'
  },
  lateral_step_elastico: {
    id: 'lateral_step_elastico',
    name: 'Passo Lateral com Elástico',
    muscles: ['Glúteo médio', 'Anca'],
    equipment: 'elástico',
    coreIntensity: 'leve',
    desc: 'Com o elástico à volta dos tornozelos ou acima dos joelhos, em meio-agachamento, dá pequenos passos para o lado mantendo tensão no elástico.',
    tip: 'Sem elástico funciona também — foca-te em manter os joelhos alinhados com os pés.'
  },
  step_up_degrau: {
    id: 'step_up_degrau',
    name: 'Step-Up num Degrau Baixo',
    muscles: ['Glúteos', 'Quadríceps'],
    equipment: 'peso do corpo',
    coreIntensity: 'leve',
    desc: 'Usa o primeiro degrau de uma escada ou um step baixo e estável. Sobe com uma perna, junta a outra, desce pela mesma perna. Troca o lado.',
    tip: 'Escolhe uma altura confortável — o objetivo é controlo, não altura.'
  },

  // ---- Core suave (seguro pós-bariátrica, evitado perto das cirurgias) ----
  bird_dog: {
    id: 'bird_dog',
    name: 'Bird Dog (Cão de Aponta)',
    muscles: ['Core profundo', 'Lombar', 'Equilíbrio'],
    equipment: 'peso do corpo',
    coreIntensity: 'leve',
    desc: 'De quatro apoios, estende o braço direito à frente e a perna esquerda atrás ao mesmo tempo, mantendo as ancas niveladas. Volta e alterna o lado.',
    tip: 'Movimento lento e controlado — imagina um copo de água em cima das costas que não podes entornar.'
  },
  dead_bug_suave: {
    id: 'dead_bug_suave',
    name: 'Dead Bug Suave',
    muscles: ['Core profundo'],
    equipment: 'peso do corpo',
    coreIntensity: 'leve',
    desc: 'Deitada de costas, joelhos dobrados a 90°, braços apontados ao teto. Baixa devagar um braço atrás da cabeça e a perna oposta em direção ao chão, sem tocar. Volta e alterna.',
    tip: 'Mantém a zona lombar sempre encostada ao chão. Se sentires tensão excessiva no abdómen, reduz a amplitude.'
  },
  pelvic_tilt: {
    id: 'pelvic_tilt',
    name: 'Báscula Pélvica',
    muscles: ['Core profundo', 'Lombar'],
    equipment: 'peso do corpo',
    coreIntensity: 'leve',
    desc: 'Deitada de costas, joelhos dobrados. Achata suavemente a zona lombar contra o chão contraindo o baixo abdómen, depois relaxa.',
    tip: 'Um movimento muito pequeno e gentil — perfeito para ativar o core sem esforço nenhum.'
  },
  seated_march: {
    id: 'seated_march',
    name: 'Marcha Sentada',
    muscles: ['Core leve', 'Flexores da anca'],
    equipment: 'cadeira',
    coreIntensity: 'leve',
    desc: 'Sentada numa cadeira com as costas direitas, eleva um joelho de cada vez, como se estivesses a marchar no lugar sentada.',
    tip: 'Ritmo calmo. Podes acompanhar com música para tornar mais agradável.'
  },
  gentle_twist_seated: {
    id: 'gentle_twist_seated',
    name: 'Rotação de Tronco Sentada',
    muscles: ['Oblíquos leve', 'Mobilidade'],
    equipment: 'cadeira',
    coreIntensity: 'leve',
    desc: 'Sentada, costas direitas, roda o tronco suavemente para um lado e depois para o outro, com as mãos apoiadas nas coxas ou nos braços da cadeira.',
    tip: 'Roda só até onde for confortável — não é para espremer, é para soltar.'
  },

  // ---- Costas e postura ----
  superman_leve: {
    id: 'superman_leve',
    name: 'Superman Suave',
    muscles: ['Lombar', 'Glúteos', 'Costas'],
    equipment: 'peso do corpo',
    coreIntensity: 'leve',
    desc: 'Deitada de barriga para baixo, braços estendidos à frente. Eleva ligeiramente braços e pernas do chão ao mesmo tempo, mantém 2 segundos, desce devagar.',
    tip: 'Amplitude pequena — não precisas de subir muito para sentires o trabalho nas costas.'
  },
  cat_cow: {
    id: 'cat_cow',
    name: 'Gato-Vaca (Cat-Cow)',
    muscles: ['Coluna', 'Mobilidade'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'De quatro apoios, alterna entre arquear as costas para cima (gato) e deixar cair a barriga com o peito para cima (vaca), seguindo a respiração.',
    tip: 'Sincroniza com a respiração: inspira na vaca, expira no gato. Ótimo para soltar a coluna.'
  },

  // ---- Mobilidade, respiração e alongamento (base do modo recuperação) ----
  marcha_lugar: {
    id: 'marcha_lugar',
    name: 'Marcha no Lugar',
    muscles: ['Corpo inteiro', 'Cardio muito leve'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Em pé (ou sentada, se preferires), marcha no lugar num ritmo confortável, balançando os braços suavemente.',
    tip: 'Ideal para aquecer ou para dias de pouca energia — qualquer ritmo conta.'
  },
  respiracao_diafragmatica: {
    id: 'respiracao_diafragmatica',
    name: 'Respiração Diafragmática',
    muscles: ['Diafragma', 'Relaxamento'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Deitada ou sentada confortavelmente, uma mão na barriga. Inspira devagar pelo nariz sentindo a barriga a subir, expira lentamente pela boca.',
    tip: 'Muito recomendada nos primeiros dias após qualquer cirurgia — ajuda a relaxar e a oxigenar bem o corpo.'
  },
  alongamento_lateral: {
    id: 'alongamento_lateral',
    name: 'Alongamento Lateral do Tronco',
    muscles: ['Flanco', 'Mobilidade'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Em pé ou sentada, eleva um braço e inclina suavemente o tronco para o lado oposto, sentindo o alongamento no flanco. Troca o lado.',
    tip: 'Sem saltos nem movimentos bruscos — só um alongamento suave e confortável.'
  },
  alongamento_posterior: {
    id: 'alongamento_posterior',
    name: 'Alongamento do Posterior da Coxa',
    muscles: ['Posterior de coxa'],
    equipment: 'cadeira',
    coreIntensity: 'nenhuma',
    desc: 'Sentada na beira da cadeira, estica uma perna à frente com o calcanhar no chão. Inclina levemente o tronco à frente até sentires o alongamento atrás da coxa.',
    tip: 'Mantém as costas direitas — o alongamento vem da anca, não de curvar a coluna.'
  },
  ankle_pump: {
    id: 'ankle_pump',
    name: 'Bombeamento de Tornozelo',
    muscles: ['Circulação', 'Tornozelo'],
    equipment: 'cadeira',
    coreIntensity: 'nenhuma',
    desc: 'Sentada ou deitada, aponta e flete os pés alternadamente, como se estivesses a carregar num pedal invisível.',
    tip: 'Excelente para a circulação nos dias de repouso pós-operatório — podes fazer em qualquer lugar.'
  },
  heel_slide: {
    id: 'heel_slide',
    name: 'Deslize de Calcanhar',
    muscles: ['Pernas', 'Mobilidade suave'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Deitada de costas, desliza um calcanhar pelo chão afastando e aproximando a perna do corpo, joelho a dobrar e esticar devagar.',
    tip: 'Muito suave — ótimo para os primeiros dias de recuperação, sem tensão no abdómen.'
  },
  neck_stretch: {
    id: 'neck_stretch',
    name: 'Alongamento de Pescoço',
    muscles: ['Pescoço', 'Relaxamento'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Sentada com as costas direitas, inclina a cabeça suavemente para um ombro, mantém alguns segundos, volta ao centro e repete do outro lado.',
    tip: 'Nunca force — é para relaxar tensão, não para espremer.'
  },
  arm_circle_leve: {
    id: 'arm_circle_leve',
    name: 'Círculos de Braços',
    muscles: ['Ombros', 'Mobilidade'],
    equipment: 'peso do corpo',
    coreIntensity: 'nenhuma',
    desc: 'Braços esticados para os lados, faz pequenos círculos, aumentando gradualmente a amplitude, depois inverte o sentido.',
    tip: 'Começa com círculos pequenos — vai aumentando só se estiver confortável.'
  }
};
