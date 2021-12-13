export interface CardProps {
    class?: string,
    children: JSX.Element,
    size?: CardSize,
    key?: string
};

export enum CardSize {
    Small = 'small',
    Large = 'large'
}