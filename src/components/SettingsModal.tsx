import { useState, useRef } from "react";
import type { DatabaseConfig, DBType } from "../types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Paper,
    Chip,
    FormControl,
    InputLabel,
    Alert,
    Divider,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    databases: DatabaseConfig[];
    onSave: (databases: DatabaseConfig[]) => void;
}

export default function SettingsModal({ open, onClose, databases, onSave }: SettingsModalProps) {
    const [localDatabases, setLocalDatabases] = useState<DatabaseConfig[]>(databases);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newDb, setNewDb] = useState<Omit<DatabaseConfig, 'id'>>({
        name: "",
        type: "mssql",
        dbServer: "",
        database: "",
        schema: "",
        description: "",
    });
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        if (!newDb.name || !newDb.dbServer || !newDb.database || !newDb.schema) {
            setUploadError("Please fill in all required fields");
            return;
        }

        const id = `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setLocalDatabases([...localDatabases, { ...newDb, id }]);
        setNewDb({
            name: "",
            type: "mssql",
            dbServer: "",
            database: "",
            schema: "",
            description: "",
        });
        setUploadError(null);
    };

    const handleDelete = (id: string) => {
        setLocalDatabases(localDatabases.filter(db => db.id !== id));
    };

    const handleEdit = (db: DatabaseConfig) => {
        setEditingId(db.id);
    };

    const handleSaveEdit = (id: string, updated: DatabaseConfig) => {
        setLocalDatabases(localDatabases.map(db => db.id === id ? updated : db));
        setEditingId(null);
    };

    const handleSave = () => {
        onSave(localDatabases);
        onClose();
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(localDatabases, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `database-configs-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                let imported: DatabaseConfig[];

                if (file.name.endsWith('.json')) {
                    imported = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    imported = parseCSV(content);
                } else {
                    setUploadError("Please upload a JSON or CSV file");
                    return;
                }

                // Validate structure
                if (!Array.isArray(imported)) {
                    setUploadError("Invalid file format: expected an array of database configurations");
                    return;
                }

                // Add IDs if missing
                const withIds = imported.map(db => ({
                    ...db,
                    id: db.id || `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                }));

                setLocalDatabases([...localDatabases, ...withIds]);
                setUploadError(null);
            } catch (err) {
                setUploadError(err instanceof Error ? err.message : "Failed to parse file");
            }
        };
        reader.readAsText(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const parseCSV = (content: string): DatabaseConfig[] => {
        const lines = content.trim().split('\n');
        if (lines.length < 2) throw new Error("CSV file is empty or invalid");

        const headers = lines[0].split(',').map(h => h.trim());
        const result: DatabaseConfig[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });

            result.push({
                id: obj.id || `db_${Date.now()}_${i}`,
                name: obj.name || '',
                type: (obj.type as any) || 'mssql',
                dbServer: obj.dbServer || '',
                database: obj.database || '',
                schema: obj.schema || '',
                description: obj.description || '',
            });
        }

        return result;
    };

    const exportTemplate = () => {
        const template = [
            {
                id: "example_1",
                name: "Production DB",
                type: "mssql",
                dbServer: "prod-server.company.com",
                database: "ProductionDB",
                schema: "dbo",
                description: "Production database server"
            }
        ];
        const dataStr = JSON.stringify(template, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'database-config-template.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 2
            }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ⚙️ Database Configuration Settings
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 3 }}>
                {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
                        {uploadError}
                    </Alert>
                )}

                {/* Import/Export Section */}
                <Paper sx={{ p: 2.5, mb: 3, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                        📁 Import / Export Configurations
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <Button
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            size="small"
                        >
                            Import JSON/CSV
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            size="small"
                            disabled={localDatabases.length === 0}
                        >
                            Export JSON
                        </Button>
                        <Button
                            variant="text"
                            startIcon={<DownloadIcon />}
                            onClick={exportTemplate}
                            size="small"
                        >
                            Download Template
                        </Button>
                    </Box>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,.csv"
                        style={{ display: 'none' }}
                        onChange={handleImport}
                    />
                </Paper>

                {/* Add New Database */}
                <Paper sx={{ p: 3, mb: 3, border: '2px dashed #d1d5db' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                        ➕ Add New Database Configuration
                    </Typography>
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
                        <TextField
                            label="Configuration Name"
                            value={newDb.name}
                            onChange={(e) => setNewDb({ ...newDb, name: e.target.value })}
                            size="small"
                            required
                            placeholder="e.g., Production DB"
                        />
                        <FormControl size="small">
                            <InputLabel>Database Type</InputLabel>
                            <Select
                                value={newDb.type}
                                onChange={(e) => setNewDb({ ...newDb, type: e.target.value as DBType })}
                                label="Database Type"
                            >
                                <MenuItem value="mssql">MS SQL Server</MenuItem>
                                <MenuItem value="mysql">MySQL</MenuItem>
                                <MenuItem value="odbc">ODBC</MenuItem>
                                <MenuItem value="db2">IBM DB2</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="DB Server"
                            value={newDb.dbServer}
                            onChange={(e) => setNewDb({ ...newDb, dbServer: e.target.value })}
                            size="small"
                            required
                            placeholder="server.company.com"
                        />
                        <TextField
                            label="Database Name"
                            value={newDb.database}
                            onChange={(e) => setNewDb({ ...newDb, database: e.target.value })}
                            size="small"
                            required
                            placeholder="MyDatabase"
                        />
                        <TextField
                            label="Schema"
                            value={newDb.schema}
                            onChange={(e) => setNewDb({ ...newDb, schema: e.target.value })}
                            size="small"
                            required
                            placeholder="dbo"
                        />
                        <TextField
                            label="Description (Optional)"
                            value={newDb.description}
                            onChange={(e) => setNewDb({ ...newDb, description: e.target.value })}
                            size="small"
                            placeholder="Brief description"
                        />
                    </Box>
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAdd}
                            fullWidth
                        >
                            Add Configuration
                        </Button>
                    </Box>
                </Paper>

                <Divider sx={{ my: 3 }} />

                {/* Saved Databases */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                    💾 Saved Configurations ({localDatabases.length})
                </Typography>

                {localDatabases.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        border: '2px dashed #e5e7eb'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            No database configurations saved yet. Add one above or import from a file.
                        </Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {localDatabases.map((db) => (
                            <Paper key={db.id} sx={{ p: 2, border: '1px solid #e5e7eb' }}>
                                {editingId === db.id ? (
                                    <EditableDbConfig
                                        db={db}
                                        onSave={(updated) => handleSaveEdit(db.id, updated)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                                    {db.name}
                                                </Typography>
                                                {db.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {db.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box display="flex" gap={1}>
                                                <IconButton size="small" onClick={() => handleEdit(db)} color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDelete(db.id)} color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Box display="flex" gap={1} flexWrap="wrap">
                                            <Chip label={db.type.toUpperCase()} size="small" color="primary" />
                                            <Chip label={`Server: ${db.dbServer}`} size="small" variant="outlined" />
                                            <Chip label={`DB: ${db.database}`} size="small" variant="outlined" />
                                            <Chip label={`Schema: ${db.schema}`} size="small" variant="outlined" />
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#f9fafb' }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
                    Save & Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function EditableDbConfig({
    db,
    onSave,
    onCancel
}: {
    db: DatabaseConfig;
    onSave: (db: DatabaseConfig) => void;
    onCancel: () => void;
}) {
    const [edited, setEdited] = useState<DatabaseConfig>(db);

    return (
        <Box>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2} mb={2}>
                <TextField
                    label="Configuration Name"
                    value={edited.name}
                    onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                    size="small"
                />
                <FormControl size="small">
                    <InputLabel>Database Type</InputLabel>
                    <Select
                        value={edited.type}
                        onChange={(e) => setEdited({ ...edited, type: e.target.value as any })}
                        label="Database Type"
                    >
                        <MenuItem value="mssql">MS SQL Server</MenuItem>
                        <MenuItem value="mysql">MySQL</MenuItem>
                        <MenuItem value="odbc">ODBC</MenuItem>
                        <MenuItem value="db2">IBM DB2</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="DB Server"
                    value={edited.dbServer}
                    onChange={(e) => setEdited({ ...edited, dbServer: e.target.value })}
                    size="small"
                />
                <TextField
                    label="Database Name"
                    value={edited.database}
                    onChange={(e) => setEdited({ ...edited, database: e.target.value })}
                    size="small"
                />
                <TextField
                    label="Schema"
                    value={edited.schema}
                    onChange={(e) => setEdited({ ...edited, schema: e.target.value })}
                    size="small"
                />
                <TextField
                    label="Description"
                    value={edited.description || ''}
                    onChange={(e) => setEdited({ ...edited, description: e.target.value })}
                    size="small"
                />
            </Box>
            <Box display="flex" gap={1} justifyContent="flex-end">
                <Button size="small" onClick={onCancel}>Cancel</Button>
                <Button size="small" variant="contained" onClick={() => onSave(edited)}>Save</Button>
            </Box>
        </Box>
    );
}
