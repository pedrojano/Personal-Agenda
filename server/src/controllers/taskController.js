const db = require("../config/db");

exports.createTask = async (req, res) => {
  const { title, description, start_date, end_date, color } = req.body;

  const userId = req.userId;

  try {
    if (!title || !start_date || !end_date) {
      return res
        .status(400)
        .json({ error: "Titulo, data de inicio e fim são obrigatórios!" });
    }

    const query = `
        INSERT INTO tasks (title, description, start_date, end_date, color, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

    const values = [
      title,
      description,
      start_date,
      end_date,
      color || null,
      userId,
    ];
    const result = await db.query(query, values);

    res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro interno ao salvar tarefa." });
  }
};

exports.getTasks = async (req, res) => {
  const userId = req.userId;

  try {
    const query = `
        SELECT * FROM tasks
        WHERE user_id = $1
        ORDER BY start_date ASC
        `;

    const result = await db.query(query, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro interno ao buscar tarefas." });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { title, description, start_date, end_date, color, status } = req.body;

  try {
    const checkQuery = "SELECT * FROM tasks WHERE id = $1 AND user_id = $2";
    const checkResult = await db.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: "Tarefa não encontrada ou não autorizada",
      });
    }

    const query = `
        UPDATE tasks
        SET title =$1, 
            description = $2,
            start_date = $3, 
            end_date = $4, 
            color = $5, 
            status = $6
        WHERE id = $7 AND user_id = $8
        RETURNING *`;

    const oldTask = checkResult.rows[0];
    const values = [
      title || oldTask.title,
      description || oldTask.description,
      start_date || oldTask.start_date,
      end_date || oldTask.end_date,
      color || oldTask.color,
      status || oldTask.status,
      id,
      userId
    ];

    const result = await db.query(query, values);
    res.json({
      message: "Tarefa atualizada",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Errro ao atualizar:", error);
    res.status(500).json({
      error: "Erro interno",
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const query = "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await db.query(query, [id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Tarefa não encontrada",
      });
    }

    res.json({
      message: "Tarefa excluida com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar", error);
    res.status(500).json({
      error: "Erro interno",
    });
  }
};

exports.getDashboard = async (req, res) => {
    
    const userId = req.userId;

    try{
        const query = `
      SELECT 
        SUM(CASE WHEN status = 'CONCLUIDA' THEN 1 ELSE 0 END) ::int as completed_count,
        SUM(CASE WHEN status = 'PENDENTE' THEN 1 ELSE 0 END) ::int as pending_count,
        SUM(CASE WHEN status = 'CANCELADA' THEN 1 ELSE 0 END) ::int as cancelled_count,
        SUM(CASE WHEN is_rescheduled = true THEN 1 ELSE 0 END) ::int as rescheduled_count,
        COUNT(*) ::int as total_tasks
      FROM tasks 
      WHERE user_id = $1
    `;
    const result = await db.query(query, [userId]);

    const metrics = result.rows[0];

    res.json({
        message: "Métricas carregadas",
        data: metrics
    });
    }catch(error){
        console.error("Erro no dashboard", error);
        res.status(500).json({
            error: "Erro ao calcular métricas"
        });
    }
};
