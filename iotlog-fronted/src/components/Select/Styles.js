import chroma from 'chroma-js';

export const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

export const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white', fontSize: 13, border: '1px solid #e1e5eb' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        if (!data.color)
            return styles

        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? data.color
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',
            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
            },
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma('#2d53fe');
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        fontSize: 13,
        color: '#2d53fe',
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: '#2d53fe',
        ':hover': {
            backgroundColor: '#2d53fe',
            color: 'white',
        },
    }),
    singleValue: (styles, { data }) => {
        if (!data.color)
            return styles;

        return { ...styles, ...dot(data.color) }
    },
};