export interface CardProps {
    class?: string,
    children: JSX.Element,
    size?: CardSize,
};

export enum CardSize {
    Small = 'small',
    Large = 'large'
}