import type { Validation } from "../types";
import { Box, TextField, Select, MenuItem, IconButton, Paper, Typography, Chip, FormControlLabel, Checkbox, Radio, RadioGroup, FormControl, FormLabel, Collapse } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from "react";

function defaultValidationFor(type: string): Validation {
    switch(type) {
        case "row_count": return { type: "row_count", name: "Row Count Match", enabled: true, tolerance: 0.01 };
        case "row_compare": return { type: "row_compare", name: "Row Compare Validation", enabled: true, key_columns: ["ACCTAH"], compare_columns: [] , ignore_case:true, trim_whitespace:true, null_equals_blank:false, allow_duplicate_keys:false, log_duplicates:true, max_mismatches:100, stop_on_first_mismatch:false, exclude_columns:[], include_only_columns:[] };
        case "column_count": return { type: "column_count", name: "Column Count match", enabled: true, targetCount: 18 };
        case "null_check": return { type: "null_check", name: "Null Check - Target", enabled: true, columns: ["ACCTAH"], threshold: 0, fail_on_any:false, scope:"target" };
        case "col_value_check": return { type: "col_value_check", name: "Value Check - Target", enabled: true, columns: ["ACCTAH"], expected_col_value: "123" };
        case "duplicate_check": return { type: "duplicate_check", name: "Duplicate Check - Customer Table", enabled: true, columns: ["ACCTAH","LVDTAH"], group_by: ["region"], threshold:0, fail_on_any:true, scope:"target", ignore_case:true, trim_whitespace:true };
        case "schema_compare": return {
            type: "schema_compare",
            name: "Schema Comparison",
            enabled: true,
            check: {
                datatype: true,
                length: true,
                nullable: true,
                default: true,
                primary_key: true,
                column_order: true,
                extra_columns: true,
                missing_columns: true,
                ignore_case: true,
                strict_mode: false
            },
            json_schema_path: ""
        };
        case "insert_existing_data": return {
            type: "insert_existing_data",
            name: "Insert data to DB by Copying existing Rows",
            enabled: true,
            scope: "source",
            row_count: 2,
            exclude_columns: [],
            columns_to_auto_populate_data: []
        };
        default: throw new Error("unknown");
    }
}

const validationColors: Record<string, { bg: string; color: string; gradient: string }> = {
    row_count: { bg: '#fef3c7', color: '#92400e', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
    row_compare: { bg: '#dbeafe', color: '#1e40af', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    column_count: { bg: '#d1fae5', color: '#065f46', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    null_check: { bg: '#fecaca', color: '#991b1b', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
    col_value_check: { bg: '#e9d5ff', color: '#6b21a8', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
    duplicate_check: { bg: '#fed7aa', color: '#9a3412', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    schema_compare: { bg: '#ddd6fe', color: '#5b21b6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    insert_existing_data: { bg: '#bfdbfe', color: '#1e3a8a', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
};

const validationIcons: Record<string, string> = {
    row_count: '📊',
    row_compare: '🔄',
    column_count: '📋',
    null_check: '⚠️',
    col_value_check: '🔍',
    duplicate_check: '🔁',
    schema_compare: '🗂️',
    insert_existing_data: '➕',
};

export default function ValidationBuilder({ validations, onAdd, onUpdate, onRemove }:
                                          { validations: Validation[]; onAdd: (v: Validation) => void; onUpdate: (i:number,v:Validation)=>void; onRemove: (i:number)=>void }) {
    const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set(validations.map((_, i) => i)));

    const toggleExpanded = (idx: number) => {
        const newSet = new Set(expandedIndexes);
        if (newSet.has(idx)) {
            newSet.delete(idx);
        } else {
            newSet.add(idx);
        }
        setExpandedIndexes(newSet);
    };

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                mt: 3,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
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
                    ⚙️ Data Validations
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    Add and configure validation rules for your ETL pipeline
                </Typography>
            </Box>
            
            <Box sx={{ 
                backgroundColor: '#ffffff', 
                p: 4,
                borderRadius: '16px 16px 0 0'
            }}>
                <Box display="flex" gap={2} mb={4} alignItems="center">
                    <Select 
                        onChange={(e)=> {
                            onAdd(defaultValidationFor(e.target.value as string));
                            setExpandedIndexes(new Set([...Array.from(expandedIndexes), validations.length]));
                        }} 
                        value="" 
                        displayEmpty
                        sx={{ 
                            minWidth: 280,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fa709a',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fa709a',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fa709a',
                            },
                        }}
                    >
                        <MenuItem value="" disabled>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AddCircleIcon sx={{ color: '#fa709a' }} />
                                <span>Add validation rule...</span>
                            </Box>
                        </MenuItem>
                        <MenuItem value="row_count">📊 Row Count</MenuItem>
                        <MenuItem value="row_compare">🔄 Row Compare</MenuItem>
                        <MenuItem value="column_count">📋 Column Count</MenuItem>
                        <MenuItem value="null_check">⚠️ Null Check</MenuItem>
                        <MenuItem value="col_value_check">🔍 Value Check</MenuItem>
                        <MenuItem value="duplicate_check">🔁 Duplicate Check</MenuItem>
                        <MenuItem value="schema_compare">🗂️ Schema Compare</MenuItem>
                        <MenuItem value="insert_existing_data">➕ Insert Existing Data</MenuItem>
                    </Select>
                    <Typography variant="body2" color="text.secondary">
                        {validations.length} {validations.length === 1 ? 'validation' : 'validations'} configured
                    </Typography>
                </Box>

                {validations.length === 0 && (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 8, 
                            px: 4,
                            backgroundColor: '#f9fafb',
                            borderRadius: 2,
                            border: '2px dashed #e5e7eb'
                        }}
                    >
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No validations yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Select a validation type from the dropdown above to get started
                        </Typography>
                    </Box>
                )}

                {validations.map((v, idx) => {
                    const colors = validationColors[v.type] || validationColors.row_count;
                    const icon = validationIcons[v.type] || '⚙️';
                    const isExpanded = expandedIndexes.has(idx);

                    return (
                        <Paper 
                            key={idx} 
                            elevation={0} 
                            sx={{ 
                                mb: 2.5, 
                                border: '2px solid',
                                borderColor: isExpanded ? colors.color : '#e5e7eb',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    borderColor: colors.color,
                                    boxShadow: `0 4px 20px ${colors.bg}`,
                                },
                            }}
                        >
                            {/* Header */}
                            <Box 
                                sx={{ 
                                    p: 2.5,
                                    background: isExpanded ? colors.gradient : '#f9fafb',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => toggleExpanded(idx)}
                            >
                                <Box display="flex" alignItems="center" gap={2} flex={1}>
                                    <Box 
                                        sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            borderRadius: '10px',
                                            background: isExpanded ? 'rgba(255,255,255,0.3)' : colors.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                        }}
                                    >
                                        {icon}
                                    </Box>
                                    <Box flex={1}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600, 
                                                color: isExpanded ? 'white' : '#1f2937',
                                                mb: 0.5
                                            }}
                                        >
                                            {v.name || `${v.type} validation`}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip 
                                                label={v.type} 
                                                size="small" 
                                                sx={{ 
                                                    height: 22,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    backgroundColor: isExpanded ? 'rgba(255,255,255,0.25)' : colors.bg,
                                                    color: isExpanded ? 'white' : colors.color,
                                                    border: 'none'
                                                }} 
                                            />
                                            <Chip 
                                                label={(v as any).enabled ? 'Enabled' : 'Disabled'} 
                                                size="small" 
                                                sx={{ 
                                                    height: 22,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    backgroundColor: isExpanded ? 'rgba(255,255,255,0.25)' : ((v as any).enabled ? '#d1fae5' : '#fee2e2'),
                                                    color: isExpanded ? 'white' : ((v as any).enabled ? '#065f46' : '#991b1b'),
                                                    border: 'none'
                                                }} 
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <IconButton 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(idx);
                                        }} 
                                        sx={{ 
                                            color: isExpanded ? 'white' : '#ef4444',
                                            '&:hover': { 
                                                backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : 'rgba(239, 68, 68, 0.1)' 
                                            }
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                    <IconButton 
                                        sx={{ 
                                            color: isExpanded ? 'white' : '#6b7280',
                                        }}
                                    >
                                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Collapsible Content */}
                            <Collapse in={isExpanded} timeout="auto">
                                <Box sx={{ p: 3, backgroundColor: '#ffffff' }}>
                                    <Box display="grid" gap={2.5}>
                                        {/* Common fields */}
                                        <Box gridColumn="span 8">
                                            <TextField
                                                fullWidth 
                                                label="Validation Name" 
                                                value={(v as any).name || ""} 
                                                onChange={(e)=> onUpdate(idx, {...v, name: e.target.value} as Validation)} 
                                                size="small"
                                            />
                                        </Box>

                                        <Box gridColumn="span 4">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        checked={(v as any).enabled ?? true} 
                                                        onChange={(e)=> onUpdate(idx, {...v, enabled: e.target.checked} as Validation)} 
                                                    />
                                                }
                                                label="Enabled"
                                            />
                                        </Box>

                                        {/* Row Count Validation */}
                                        {v.type === "row_count" && (
                                            <Box gridColumn="span 6">
                                                <TextField
                                                    fullWidth
                                                    label="Tolerance (0-1)" 
                                                    type="number" 
                                                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                                                    value={(v as any).tolerance ?? ""} 
                                                    onChange={(e)=> onUpdate(idx, {...v, tolerance: parseFloat(e.target.value)} as Validation)} 
                                                    size="small"
                                                />
                                            </Box>
                                        )}

                                        {/* Row Compare Validation */}
                                        {v.type === "row_compare" && (
                                            <>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Key columns (comma separated)" 
                                                        value={(v as any).key_columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, key_columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Compare columns (comma separated, empty=all)" 
                                                        value={(v as any).compare_columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, compare_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Exclude columns (comma separated)" 
                                                        value={(v as any).exclude_columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, exclude_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Include only columns (comma separated)" 
                                                        value={(v as any).include_only_columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, include_only_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Max mismatches" 
                                                        type="number" 
                                                        value={(v as any).max_mismatches ?? ""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, max_mismatches: parseInt(e.target.value)} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 12">
                                                    <Paper sx={{ p: 2, backgroundColor: '#f9fafb' }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151' }}>
                                                            Comparison Options
                                                        </Typography>
                                                        <Box display="grid" gap={1}>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).ignore_case ?? true} onChange={(e)=> onUpdate(idx, {...v, ignore_case: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Ignore case</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).trim_whitespace ?? true} onChange={(e)=> onUpdate(idx, {...v, trim_whitespace: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Trim whitespace</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).null_equals_blank ?? false} onChange={(e)=> onUpdate(idx, {...v, null_equals_blank: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Null equals blank</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).allow_duplicate_keys ?? false} onChange={(e)=> onUpdate(idx, {...v, allow_duplicate_keys: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Allow duplicate keys</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).log_duplicates ?? true} onChange={(e)=> onUpdate(idx, {...v, log_duplicates: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Log duplicates</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).stop_on_first_mismatch ?? false} onChange={(e)=> onUpdate(idx, {...v, stop_on_first_mismatch: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Stop on first mismatch</Typography>}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Box>
                                            </>
                                        )}

                                        {/* Column Count Validation */}
                                        {v.type === "column_count" && (
                                            <Box gridColumn="span 6">
                                                <TextField
                                                    fullWidth
                                                    label="Target Count" 
                                                    type="number" 
                                                    value={(v as any).targetCount ?? ""} 
                                                    onChange={(e)=> onUpdate(idx, {...v, targetCount: parseInt(e.target.value)} as Validation)} 
                                                    size="small"
                                                />
                                            </Box>
                                        )}

                                        {/* Null Check Validation */}
                                        {v.type === "null_check" && (
                                            <>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Columns (comma separated)" 
                                                        value={(v as any).columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 3">
                                                    <TextField
                                                        fullWidth
                                                        label="Threshold" 
                                                        type="number" 
                                                        value={(v as any).threshold ?? ""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, threshold: parseInt(e.target.value)} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 3">
                                                    <FormControlLabel
                                                        control={<Checkbox checked={(v as any).fail_on_any ?? false} onChange={(e)=> onUpdate(idx, {...v, fail_on_any: e.target.checked} as Validation)} />}
                                                        label="Fail on any"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 12">
                                                    <FormControl>
                                                        <FormLabel sx={{ fontSize: '0.875rem' }}>Scope</FormLabel>
                                                        <RadioGroup 
                                                            value={(v as any).scope || "target"} 
                                                            onChange={(e)=> onUpdate(idx, {...v, scope: e.target.value} as Validation)}
                                                            row
                                                        >
                                                            <FormControlLabel value="source" control={<Radio />} label="Source" />
                                                            <FormControlLabel value="target" control={<Radio />} label="Target" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Box>
                                            </>
                                        )}

                                        {/* Column Value Check Validation */}
                                        {v.type === "col_value_check" && (
                                            <>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Columns (comma separated)" 
                                                        value={(v as any).columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Expected column value" 
                                                        value={(v as any).expected_col_value || ""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, expected_col_value: e.target.value} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                            </>
                                        )}

                                        {/* Duplicate Check Validation */}
                                        {v.type === "duplicate_check" && (
                                            <>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Columns (comma separated)" 
                                                        value={(v as any).columns?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, columns: e.target.value.split(",").map(s=>s.trim())} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Group by (comma separated)" 
                                                        value={(v as any).group_by?.join(",")||""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, group_by: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 4">
                                                    <TextField
                                                        fullWidth
                                                        label="Threshold" 
                                                        type="number" 
                                                        value={(v as any).threshold ?? ""} 
                                                        onChange={(e)=> onUpdate(idx, {...v, threshold: parseInt(e.target.value)} as Validation)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 8">
                                                    <Paper sx={{ p: 2, backgroundColor: '#f9fafb' }}>
                                                        <Box display="grid" gap={1}>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).fail_on_any ?? true} onChange={(e)=> onUpdate(idx, {...v, fail_on_any: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Fail on any</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).ignore_case ?? true} onChange={(e)=> onUpdate(idx, {...v, ignore_case: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Ignore case</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox checked={(v as any).trim_whitespace ?? true} onChange={(e)=> onUpdate(idx, {...v, trim_whitespace: e.target.checked} as Validation)} />}
                                                                label={<Typography variant="body2">Trim whitespace</Typography>}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Box>
                                                <Box gridColumn="span 12">
                                                    <FormControl>
                                                        <FormLabel sx={{ fontSize: '0.875rem' }}>Scope</FormLabel>
                                                        <RadioGroup 
                                                            value={(v as any).scope || "target"} 
                                                            onChange={(e)=> onUpdate(idx, {...v, scope: e.target.value} as Validation)}
                                                            row
                                                        >
                                                            <FormControlLabel value="source" control={<Radio />} label="Source" />
                                                            <FormControlLabel value="target" control={<Radio />} label="Target" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Box>
                                            </>
                                        )}

                                        {/* Schema Compare Validation */}
                                        {v.type === "schema_compare" && (
                                            <>
                                                <Box gridColumn="span 12">
                                                    <TextField
                                                        fullWidth
                                                        label="JSON Schema Path (optional)"
                                                        value={(v as any).json_schema_path || ""}
                                                        onChange={(e)=> onUpdate(idx, {...v, json_schema_path: e.target.value} as Validation)}
                                                        size="small"
                                                        placeholder="C:\Users\qa_automation\IdeaProjects\MySchema\customer_table.json"
                                                        helperText="Optional path to external schema file for validation"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 12">
                                                    <Paper sx={{ p: 2.5, backgroundColor: '#f9fafb', border: '2px solid #e5e7eb' }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            🔍 Schema Comparison Options
                                                        </Typography>
                                                        <Box display="grid" gap={2}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.datatype ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, datatype: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Data Type</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.length ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, length: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Length</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.nullable ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, nullable: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Nullable</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.default ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, default: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Default Value</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.primary_key ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, primary_key: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Primary Key</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.column_order ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, column_order: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Column Order</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.extra_columns ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, extra_columns: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Extra Columns</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.missing_columns ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, missing_columns: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Missing Columns</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.ignore_case ?? true}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, ignore_case: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Ignore Case</Typography>}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={(v as any).check?.strict_mode ?? false}
                                                                        onChange={(e)=> onUpdate(idx, {...v, check: {...(v as any).check, strict_mode: e.target.checked}} as Validation)}
                                                                    />
                                                                }
                                                                label={<Typography variant="body2">Strict Mode</Typography>}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Box>
                                            </>
                                        )}

                                        {/* Insert Existing Data Validation */}
                                        {v.type === "insert_existing_data" && (
                                            <>
                                                <Box gridColumn="span 6">
                                                    <TextField
                                                        fullWidth
                                                        label="Row Count"
                                                        type="number"
                                                        value={(v as any).row_count ?? ""}
                                                        onChange={(e)=> onUpdate(idx, {...v, row_count: parseInt(e.target.value)} as Validation)}
                                                        size="small"
                                                        helperText="Number of rows to copy"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 6">
                                                    <FormControl fullWidth size="small">
                                                        <FormLabel sx={{ fontSize: '0.875rem', mb: 1 }}>Scope</FormLabel>
                                                        <RadioGroup
                                                            value={(v as any).scope || "source"}
                                                            onChange={(e)=> onUpdate(idx, {...v, scope: e.target.value} as Validation)}
                                                            row
                                                        >
                                                            <FormControlLabel value="source" control={<Radio />} label="Source" />
                                                            <FormControlLabel value="target" control={<Radio />} label="Target" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Box>
                                                <Box gridColumn="span 12">
                                                    <TextField
                                                        fullWidth
                                                        label="Exclude Columns (comma separated)"
                                                        value={(v as any).exclude_columns?.join(",")||""}
                                                        onChange={(e)=> onUpdate(idx, {...v, exclude_columns: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)}
                                                        size="small"
                                                        helperText="Columns to skip (e.g., auto-increment fields)"
                                                        placeholder="id, created_at, updated_at"
                                                    />
                                                </Box>
                                                <Box gridColumn="span 12">
                                                    <TextField
                                                        fullWidth
                                                        label="Columns to Auto-Populate Data (comma separated)"
                                                        value={(v as any).columns_to_auto_populate_data?.join(",")||""}
                                                        onChange={(e)=> onUpdate(idx, {...v, columns_to_auto_populate_data: e.target.value ? e.target.value.split(",").map(s=>s.trim()) : []} as Validation)}
                                                        size="small"
                                                        helperText="Columns where values should be auto-generated"
                                                        placeholder="uuid, timestamp, random_value"
                                                    />
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Collapse>
                        </Paper>
                    );
                })}
            </Box>
        </Paper>
    );
}
