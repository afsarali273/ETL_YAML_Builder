import type { JobConfig } from "../types";
import { TextField, Box, Paper, Typography } from "@mui/material";

export default function JobMetadataForm({ value, onChange }: { value: JobConfig; onChange: (v: JobConfig) => void }) {
    return (
        <Paper elevation={0} sx={{ 
            p: 4, 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)',
            }
        }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>📋 Job Configuration</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
                <TextField 
                    label="Job Name" 
                    value={value.job_name} 
                    onChange={(e) => onChange({ ...value, job_name: e.target.value })} 
                    sx={{ minWidth: 250 }}
                />
                <TextField 
                    label="Owner" 
                    value={value.owner} 
                    onChange={(e) => onChange({ ...value, owner: e.target.value })} 
                    sx={{ minWidth: 250 }}
                />
                <TextField 
                    fullWidth 
                    label="Description" 
                    value={value.description} 
                    onChange={(e) => onChange({ ...value, description: e.target.value })} 
                    multiline
                    rows={2}
                    sx={{ mt: 1 }}
                />
            </Box>
        </Paper>
    );
}
