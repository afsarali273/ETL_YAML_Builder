import type { JobConfig } from "../types";
import { TextField, Box, Paper, Typography, InputAdornment } from "@mui/material";
import StorageIcon from '@mui/icons-material/Storage';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DnsIcon from '@mui/icons-material/Dns';

export default function SourceTargetForm({ value, onChange }: { value: JobConfig; onChange: (v: JobConfig) => void }) {
    return (
        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3} sx={{ mt: 3 }}>
            {/* Source Database */}
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(17, 153, 142, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(17, 153, 142, 0.4)',
                    }
                }}
            >
                <Box sx={{ p: 4, pb: 3 }}>
                    <Typography
                        variant="h6"
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
                        📊 Source Database
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.95)',
                        }}
                    >
                        Configure your data source
                    </Typography>
                </Box>

                <Box sx={{
                    backgroundColor: '#ffffff',
                    p: 4,
                    borderRadius: '16px 16px 0 0'
                }}>
                    <Box display="flex" flexDirection="column" gap={2.5}>
                        <TextField
                            label="Database Server"
                            fullWidth
                            value={value.source.dbServer}
                            onChange={(e)=>onChange({...value, source:{...value.source, dbServer:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DnsIcon sx={{ color: '#11998e' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#11998e',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#11998e',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Database"
                            fullWidth
                            value={value.source.database}
                            onChange={(e)=>onChange({...value, source:{...value.source, database:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <StorageIcon sx={{ color: '#11998e' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#11998e',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#11998e',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Schema"
                            fullWidth
                            value={value.source.schema}
                            onChange={(e)=>onChange({...value, source:{...value.source, schema:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountTreeIcon sx={{ color: '#11998e' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#11998e',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#11998e',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Table"
                            fullWidth
                            value={value.source.table}
                            onChange={(e)=>onChange({...value, source:{...value.source, table:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TableChartIcon sx={{ color: '#11998e' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#11998e',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#11998e',
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Target Database */}
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(79, 172, 254, 0.4)',
                    }
                }}
            >
                <Box sx={{ p: 4, pb: 3 }}>
                    <Typography
                        variant="h6"
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
                        🎯 Target Database
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.95)',
                        }}
                    >
                        Configure your data destination
                    </Typography>
                </Box>

                <Box sx={{
                    backgroundColor: '#ffffff',
                    p: 4,
                    borderRadius: '16px 16px 0 0'
                }}>
                    <Box display="flex" flexDirection="column" gap={2.5}>
                        <TextField
                            label="Database Server"
                            fullWidth
                            value={value.target.dbServer}
                            onChange={(e)=>onChange({...value, target:{...value.target, dbServer:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DnsIcon sx={{ color: '#4facfe' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Database"
                            fullWidth
                            value={value.target.database}
                            onChange={(e)=>onChange({...value, target:{...value.target, database:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <StorageIcon sx={{ color: '#4facfe' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Schema"
                            fullWidth
                            value={value.target.schema}
                            onChange={(e)=>onChange({...value, target:{...value.target, schema:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountTreeIcon sx={{ color: '#4facfe' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Table"
                            fullWidth
                            value={value.target.table}
                            onChange={(e)=>onChange({...value, target:{...value.target, table:e.target.value}})}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TableChartIcon sx={{ color: '#4facfe' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4facfe',
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
