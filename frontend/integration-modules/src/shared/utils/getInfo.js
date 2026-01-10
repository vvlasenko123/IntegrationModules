export const getInfo = ({ widgetId, userId, role, board, extraConfig = {} }) => {
    return {
        widgetId,
        userId,
        role,
        board: {
            id: board.id,
            name: board.name,
            parentId: board.parentId
        },
        config: {
            ...extraConfig 
        }
    }
}
