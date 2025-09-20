import type { JobConfig } from "../types";
import { TextField, Box, Paper, Typography } from "@mui/material";

export default function SourceTargetForm({ value, onChange }: { value: JobConfig; onChange: (v: JobConfig) => void }) {
    return (
        <Box display="flex" gap={3} sx={{ mt: 3 }}>
            <Paper elevation={0} sx={{ 
                flex: 1, 
                p: 4, 
                background: 'rgba(6, 214, 160, 0.1)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(6, 214, 160, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(6, 214, 160, 0.25)',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 35px 60px -12px rgba(6, 214, 160, 0.35), 0 0 40px rgba(6, 214, 160, 0.2)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #06d6a0, transparent)',
                }
            }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    📊 Source Database
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Database Server" fullWidth value={value.source.dbServer} onChange={(e)=>onChange({...value, source:{...value.source, dbServer:e.target.value}})} />
                    <TextField label="Database" fullWidth value={value.source.database} onChange={(e)=>onChange({...value, source:{...value.source, database:e.target.value}})} />
                    <TextField label="Schema" fullWidth value={value.source.schema} onChange={(e)=>onChange({...value, source:{...value.source, schema:e.target.value}})} />
                    <TextField label="Table" fullWidth value={value.source.table} onChange={(e)=>onChange({...value, source:{...value.source, table:e.target.value}})} />
                </Box>
            </Paper>

            <Paper elevation={0} sx={{ 
                flex: 1, 
                p: 4, 
                background: 'rgba(139, 92, 246, 0.1)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 35px 60px -12px rgba(139, 92, 246, 0.35), 0 0 40px rgba(139, 92, 246, 0.2)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                }
            }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🎯 Target Database
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Database Server" fullWidth value={value.target.dbServer} onChange={(e)=>onChange({...value, target:{...value.target, dbServer:e.target.value}})} />
                    <TextField label="Database" fullWidth value={value.target.database} onChange={(e)=>onChange({...value, target:{...value.target, database:e.target.value}})} />
                    <TextField label="Schema" fullWidth value={value.target.schema} onChange={(e)=>onChange({...value, target:{...value.target, schema:e.target.value}})} />
                    <TextField label="Table" fullWidth value={value.target.table} onChange={(e)=>onChange({...value, target:{...value.target, table:e.target.value}})} />
                </Box>
            </Paper>
        </Box>
    );
}
