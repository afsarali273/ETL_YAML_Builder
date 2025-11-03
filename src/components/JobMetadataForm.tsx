import type { JobConfig } from "../types";
import { TextField, Box, Paper, Typography, Divider, InputAdornment } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';

export default function JobMetadataForm({ value, onChange }: { value: JobConfig; onChange: (v: JobConfig) => void }) {
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
        >
            <Box sx={{ p: 4, pb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 0.5,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    📋 Job Configuration
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 0
                    }}
                >
                    Define the basic metadata for your ETL job
                </Typography>
            </Box>

            <Box sx={{
                backgroundColor: '#ffffff',
                p: 4,
                borderRadius: '16px 16px 0 0'
            }}>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
                    <TextField
                        label="Job Name"
                        value={value.job_name}
                        onChange={(e) => onChange({ ...value, job_name: e.target.value })}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <WorkIcon sx={{ color: '#667eea' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#667eea',
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Owner"
                        value={value.owner}
                        onChange={(e) => onChange({ ...value, owner: e.target.value })}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: '#667eea' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#667eea',
                                },
                            },
                        }}
                    />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={value.description}
                        onChange={(e) => onChange({ ...value, description: e.target.value })}
                        multiline
                        rows={3}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                                    <DescriptionIcon sx={{ color: '#667eea' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#667eea',
                                },
                            },
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
